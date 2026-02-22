import { confirmationService } from '../../src/services/confirmation_service.js';
import { computeHmac } from '../../src/services/hmac.js';
import { REGISTRATION_STATUS } from '../../src/services/payment_constants.js';
import { reconciliationQueue } from '../../src/services/reconciliation_queue.js';
import { retryQueue } from '../../src/services/retry_queue.js';

beforeEach(() => {
  confirmationService.reset();
});

function buildPayload(overrides = {}) {
  return {
    transaction_id: 'tx_123',
    order_id: 'ord_123',
    payment_intent_id: 'pi_123',
    amount: 100,
    currency: 'USD',
    timestamp: new Date().toISOString(),
    attendee_ref: 'att_123',
    status: 'confirmed',
    ...overrides,
  };
}

test('confirmation service stores confirmation and updates status', () => {
  const payload = buildPayload();
  confirmationService.saveOrder({
    order_id: 'ord_123',
    payment_intent_id: 'pi_123',
    attendee_ref: 'att_123',
    amount: 100,
    currency: 'USD',
    status: 'pending',
  });
  const rawBody = JSON.stringify(payload);
  const signature = computeHmac(rawBody, confirmationService.getSharedSecret());
  const result = confirmationService.processConfirmation({
    payload,
    rawBody,
    signature,
    sourceChannel: 'redirect',
  });
  expect(result.ok).toBe(true);
  expect(result.result).toBe('stored');
  const order = confirmationService.getOrder('ord_123');
  expect(order.status).toBe(REGISTRATION_STATUS.paidConfirmed);
  expect(order.paid_at).toBe(payload.timestamp);
  expect(confirmationService.getConfirmations()).toHaveLength(1);
});

test('confirmation service rejects invalid signature', () => {
  const payload = buildPayload();
  confirmationService.saveOrder({
    order_id: 'ord_123',
    attendee_ref: 'att_123',
    amount: 100,
    currency: 'USD',
    status: 'pending',
  });
  const result = confirmationService.processConfirmation({
    payload,
    rawBody: JSON.stringify(payload),
    signature: 'bad',
    sourceChannel: 'redirect',
  });
  expect(result.ok).toBe(false);
  expect(result.result).toBe('rejected');
});

test('confirmation service rejects amount mismatch', () => {
  const payload = buildPayload({ amount: 150 });
  confirmationService.saveOrder({
    order_id: 'ord_123',
    attendee_ref: 'att_123',
    amount: 100,
    currency: 'USD',
    status: 'pending',
  });
  const rawBody = JSON.stringify(payload);
  const signature = computeHmac(rawBody, confirmationService.getSharedSecret());
  const result = confirmationService.processConfirmation({
    payload,
    rawBody,
    signature,
    sourceChannel: 'webhook',
  });
  expect(result.ok).toBe(false);
  expect(result.result).toBe('rejected');
});

test('confirmation service rejects timestamp outside replay window', () => {
  const payload = buildPayload({
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  });
  confirmationService.saveOrder({
    order_id: 'ord_123',
    attendee_ref: 'att_123',
    amount: 100,
    currency: 'USD',
    status: 'pending',
  });
  const rawBody = JSON.stringify(payload);
  const signature = computeHmac(rawBody, confirmationService.getSharedSecret());
  const result = confirmationService.processConfirmation({
    payload,
    rawBody,
    signature,
    sourceChannel: 'redirect',
  });
  expect(result.ok).toBe(false);
  expect(result.result).toBe('rejected');
});

test('confirmation service reports missing required fields', () => {
  const payload = { transaction_id: 'tx_missing' };
  const rawBody = JSON.stringify(payload);
  const signature = computeHmac(rawBody, confirmationService.getSharedSecret());
  const result = confirmationService.processConfirmation({ payload, rawBody, signature });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('validation_failed');
});

test('confirmation service queues unmatched confirmations', () => {
  const payload = buildPayload({ order_id: 'missing_order' });
  const rawBody = JSON.stringify(payload);
  const signature = computeHmac(rawBody, confirmationService.getSharedSecret());
  const result = confirmationService.processConfirmation({ payload, rawBody, signature });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('unmatched');
});

test('confirmation service returns duplicate without order status', () => {
  const payload = buildPayload({ order_id: 'ord_dup_missing' });
  const rawBody = JSON.stringify(payload);
  const signature = computeHmac(rawBody, confirmationService.getSharedSecret());
  confirmationService.saveOrder({
    order_id: 'ord_dup_missing',
    attendee_ref: 'att_123',
    amount: 100,
    currency: 'USD',
    status: 'pending',
  });
  confirmationService.processConfirmation({ payload, rawBody, signature, sourceChannel: 'redirect' });
  const duplicate = confirmationService.processConfirmation({ payload, rawBody, signature, sourceChannel: 'redirect' });
  expect(duplicate.result).toBe('duplicate');
});

test('confirmation service returns duplicate with null status when order missing', () => {
  const payload = buildPayload({ order_id: 'missing_dup' });
  const rawBody = JSON.stringify(payload);
  const signature = computeHmac(rawBody, confirmationService.getSharedSecret());
  confirmationService.saveOrder({
    order_id: 'other_order',
    attendee_ref: 'att_123',
    amount: 100,
    currency: 'USD',
    status: 'pending',
  });
  confirmationService.processConfirmation({ payload, rawBody, signature, sourceChannel: 'redirect' });
  const duplicate = confirmationService.processConfirmation({ payload, rawBody, signature, sourceChannel: 'redirect' });
  expect(duplicate.result).toBe('duplicate');
  expect(duplicate.registration_status).toBe(null);
});

test('confirmation service matches by payment_intent_id and attendee_ref', () => {
  confirmationService.saveOrder({
    order_id: 'ord_alt',
    payment_intent_id: 'pi_alt',
    attendee_ref: 'att_alt',
    amount: 100,
    currency: 'USD',
    status: 'pending',
  });
  const payload = buildPayload({ order_id: null, payment_intent_id: 'pi_alt', attendee_ref: 'att_alt' });
  const rawBody = JSON.stringify(payload);
  const signature = computeHmac(rawBody, confirmationService.getSharedSecret());
  const result = confirmationService.processConfirmation({ payload, signature });
  expect(result.ok).toBe(true);
});

test('confirmation service matches by attendee_ref when ids missing', () => {
  confirmationService.saveOrder({
    order_id: 'ord_att',
    attendee_ref: 'att_only',
    amount: 100,
    currency: 'USD',
    status: 'pending',
  });
  const payload = buildPayload({ order_id: null, payment_intent_id: null, attendee_ref: 'att_only' });
  const rawBody = JSON.stringify(payload);
  const signature = computeHmac(rawBody, confirmationService.getSharedSecret());
  const result = confirmationService.processConfirmation({ payload, rawBody, signature });
  expect(result.ok).toBe(true);
});

test('confirmation service treats empty attendee_ref as unmatched', () => {
  const payload = buildPayload({ order_id: null, payment_intent_id: null, attendee_ref: '' });
  const rawBody = JSON.stringify(payload);
  const signature = computeHmac(rawBody, confirmationService.getSharedSecret());
  const result = confirmationService.processConfirmation({ payload, rawBody, signature });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('unmatched');
});

test('confirmation service treats unknown attendee_ref as unmatched', () => {
  const payload = buildPayload({ order_id: null, payment_intent_id: null, attendee_ref: 'att_none' });
  const rawBody = JSON.stringify(payload);
  const signature = computeHmac(rawBody, confirmationService.getSharedSecret());
  const result = confirmationService.processConfirmation({ payload, rawBody, signature });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('unmatched');
});

test('confirmation service treats unknown payment_intent_id as unmatched', () => {
  const payload = buildPayload({ order_id: null, payment_intent_id: 'pi_unknown' });
  const rawBody = JSON.stringify(payload);
  const signature = computeHmac(rawBody, confirmationService.getSharedSecret());
  const result = confirmationService.processConfirmation({ payload, rawBody, signature });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('unmatched');
});

test('confirmation service uses default rawBody when omitted', () => {
  confirmationService.saveOrder({
    order_id: 'ord_raw',
    attendee_ref: 'att_raw',
    amount: 100,
    currency: 'USD',
    status: 'pending',
  });
  const payload = buildPayload({ order_id: 'ord_raw', attendee_ref: 'att_raw' });
  const signature = computeHmac(JSON.stringify(payload), confirmationService.getSharedSecret());
  const result = confirmationService.processConfirmation({ payload, signature });
  expect(result.ok).toBe(true);
});

test('confirmation service resets failure mode defaults', () => {
  confirmationService.setFailureMode({ confirmationStorage: true, statusUpdate: true });
  confirmationService.setFailureMode();
  confirmationService.saveOrder({
    order_id: 'ord_defaults',
    attendee_ref: 'att_defaults',
    amount: 100,
    currency: 'USD',
    status: 'pending',
  });
  const payload = buildPayload({ order_id: 'ord_defaults', attendee_ref: 'att_defaults' });
  const rawBody = JSON.stringify(payload);
  const signature = computeHmac(rawBody, confirmationService.getSharedSecret());
  const result = confirmationService.processConfirmation({ payload, rawBody, signature });
  expect(result.ok).toBe(true);
});

test('confirmation service updates shared secret', () => {
  confirmationService.setSharedSecret('new_secret');
  confirmationService.saveOrder({
    order_id: 'ord_secret',
    attendee_ref: 'att_secret',
    amount: 100,
    currency: 'USD',
    status: 'pending',
  });
  const payload = buildPayload({ order_id: 'ord_secret', attendee_ref: 'att_secret' });
  const rawBody = JSON.stringify(payload);
  const signature = computeHmac(rawBody, confirmationService.getSharedSecret());
  const result = confirmationService.processConfirmation({ payload, rawBody, signature });
  expect(result.ok).toBe(true);
});

test('confirmation service exposes stored orders', () => {
  confirmationService.saveOrder({
    order_id: 'ord_list',
    attendee_ref: 'att_list',
    amount: 100,
    currency: 'USD',
    status: 'pending',
  });
  expect(confirmationService.getOrders()).toHaveLength(1);
  expect(confirmationService.getOrder('missing')).toBe(null);
});

test('confirmation service defaults to invalid signature when called without args', () => {
  const result = confirmationService.processConfirmation();
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('invalid_signature');
});

test('confirmation service queues retry with numeric now', () => {
  confirmationService.setFailureMode({ statusUpdate: true });
  confirmationService.saveOrder({
    order_id: 'ord_retry',
    attendee_ref: 'att_retry',
    amount: 100,
    currency: 'USD',
    status: 'pending',
  });
  const payload = buildPayload({ order_id: 'ord_retry', attendee_ref: 'att_retry' });
  const rawBody = JSON.stringify(payload);
  const signature = computeHmac(rawBody, confirmationService.getSharedSecret());
  const result = confirmationService.processConfirmation({ payload, rawBody, signature, now: Date.now() });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('status_update_failed');
  expect(retryQueue.getAll()).toHaveLength(1);
});

test('confirmation service logs downstream trigger failure without reason', () => {
  confirmationService.saveOrder({
    order_id: 'ord_trigger',
    attendee_ref: 'att_trigger',
    amount: 100,
    currency: 'USD',
    status: 'pending',
  });
  const payload = buildPayload({ order_id: 'ord_trigger', attendee_ref: 'att_trigger' });
  const rawBody = JSON.stringify(payload);
  const signature = computeHmac(rawBody, confirmationService.getSharedSecret());
  const downstreamTrigger = { dispatch: () => ({ ok: false }) };
  const result = confirmationService.processConfirmation({ payload, rawBody, signature, downstreamTrigger });
  expect(result.ok).toBe(true);
});

test('confirmation service records unknown source channel on storage failure', () => {
  confirmationService.setFailureMode({ confirmationStorage: true });
  confirmationService.saveOrder({
    order_id: 'ord_fail',
    attendee_ref: 'att_fail',
    amount: 100,
    currency: 'USD',
    status: 'pending',
  });
  const payload = buildPayload({ order_id: 'ord_fail', attendee_ref: 'att_fail' });
  const rawBody = JSON.stringify(payload);
  const signature = computeHmac(rawBody, confirmationService.getSharedSecret());
  const result = confirmationService.processConfirmation({ payload, rawBody, signature });
  expect(result.ok).toBe(false);
  const entry = reconciliationQueue.getAll()[0];
  expect(entry.source_channel).toBe('unknown');
});

test('confirmation service logs downstream trigger failures', () => {
  confirmationService.saveOrder({
    order_id: 'ord_down',
    attendee_ref: 'att_down',
    amount: 100,
    currency: 'USD',
    status: 'pending',
  });
  const payload = buildPayload({ order_id: 'ord_down', attendee_ref: 'att_down' });
  const rawBody = JSON.stringify(payload);
  const signature = computeHmac(rawBody, confirmationService.getSharedSecret());
  const downstreamTrigger = { dispatch: () => ({ ok: false, reason: 'trigger_failed' }) };
  const result = confirmationService.processConfirmation({ payload, rawBody, signature, downstreamTrigger });
  expect(result.ok).toBe(true);
});
