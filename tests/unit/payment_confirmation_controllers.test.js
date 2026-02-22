import { jest } from '@jest/globals';
import { createPaymentConfirmationRedirectController } from '../../src/controllers/payment_confirmation_redirect_controller.js';
import { createPaymentConfirmationWebhookController } from '../../src/controllers/payment_confirmation_webhook_controller.js';
import { confirmationService } from '../../src/services/confirmation_service.js';
import { computeHmac } from '../../src/services/hmac.js';

function stubService(result) {
  return {
    processConfirmation: () => result,
  };
}

test('redirect controller maps invalid signature to 401', () => {
  const controller = createPaymentConfirmationRedirectController({
    confirmationService: stubService({ ok: false, result: 'rejected', reason: 'invalid_signature' }),
  });
  const response = controller.handle({ payload: {}, headers: {} });
  expect(response.status).toBe(401);
});

test('redirect controller maps duplicate to 200', () => {
  const controller = createPaymentConfirmationRedirectController({
    confirmationService: stubService({ ok: true, result: 'duplicate', registration_status: 'paid_confirmed' }),
  });
  const response = controller.handle({ payload: {}, headers: {} });
  expect(response.status).toBe(200);
  expect(response.body.result).toBe('duplicate');
});

test('redirect controller maps duplicate with missing status to null', () => {
  const controller = createPaymentConfirmationRedirectController({
    confirmationService: stubService({ ok: true, result: 'duplicate' }),
  });
  const response = controller.handle({ payload: {}, headers: {} });
  expect(response.status).toBe(200);
  expect(response.body.registration_status).toBe(null);
});

test('redirect controller maps storage failure to 500', () => {
  const controller = createPaymentConfirmationRedirectController({
    confirmationService: stubService({ ok: false, result: 'rejected', reason: 'storage_failed' }),
  });
  const response = controller.handle({ payload: {}, headers: {} });
  expect(response.status).toBe(500);
});

test('redirect controller maps status update failure to 500', () => {
  const controller = createPaymentConfirmationRedirectController({
    confirmationService: stubService({ ok: false, result: 'stored', reason: 'status_update_failed' }),
  });
  const response = controller.handle({ payload: {}, headers: {} });
  expect(response.status).toBe(500);
});

test('redirect controller maps validation failure to 400', () => {
  const controller = createPaymentConfirmationRedirectController({
    confirmationService: stubService({ ok: false, result: 'rejected', reason: 'validation_failed' }),
  });
  const response = controller.handle({ payload: {}, headers: {} });
  expect(response.status).toBe(400);
});

test('redirect controller maps success to 200', () => {
  const controller = createPaymentConfirmationRedirectController({
    confirmationService: stubService({ ok: true, result: 'stored', registration_status: 'paid_confirmed' }),
  });
  const response = controller.handle({ payload: {}, headers: {} });
  expect(response.status).toBe(200);
  expect(response.body.result).toBe('stored');
});

test('redirect controller maps missing result to 401', () => {
  const controller = createPaymentConfirmationRedirectController({
    confirmationService: stubService(null),
  });
  const response = controller.handle({ payload: {}, headers: {} });
  expect(response.status).toBe(401);
});

test('redirect controller resolves signature header', () => {
  const confirmationService = { processConfirmation: jest.fn(() => ({ ok: true, result: 'stored' })) };
  const controller = createPaymentConfirmationRedirectController({ confirmationService });
  controller.handle({ payload: {}, headers: { 'X-Signature': 'sig_1' } });
  controller.handle({ payload: {}, headers: { 'x-signature': 'sig_2' } });
  expect(confirmationService.processConfirmation).toHaveBeenCalledWith(expect.objectContaining({ signature: 'sig_1' }));
  expect(confirmationService.processConfirmation).toHaveBeenCalledWith(expect.objectContaining({ signature: 'sig_2' }));
});

test('redirect controller defaults missing headers to null signature', () => {
  const confirmationService = { processConfirmation: jest.fn(() => ({ ok: true, result: 'stored' })) };
  const controller = createPaymentConfirmationRedirectController({ confirmationService });
  controller.handle();
  expect(confirmationService.processConfirmation).toHaveBeenCalledWith(expect.objectContaining({ signature: null }));
});

test('redirect controller uses default service when omitted', () => {
  confirmationService.reset();
  confirmationService.saveOrder({
    order_id: 'ord_default',
    attendee_ref: 'att_default',
    amount: 100,
    currency: 'USD',
    status: 'pending',
  });
  const payload = {
    transaction_id: 'tx_default',
    order_id: 'ord_default',
    amount: 100,
    currency: 'USD',
    timestamp: new Date().toISOString(),
    attendee_ref: 'att_default',
    status: 'confirmed',
  };
  const rawBody = JSON.stringify(payload);
  const signature = computeHmac(rawBody, confirmationService.getSharedSecret());
  const controller = createPaymentConfirmationRedirectController();
  const response = controller.handle({ payload, rawBody, headers: { 'X-Signature': signature } });
  expect(response.status).toBe(200);
});

test('redirect controller defaults confirmation service for empty options', () => {
  confirmationService.reset();
  confirmationService.saveOrder({
    order_id: 'ord_default_2',
    attendee_ref: 'att_default_2',
    amount: 100,
    currency: 'USD',
    status: 'pending',
  });
  const payload = {
    transaction_id: 'tx_default_2',
    order_id: 'ord_default_2',
    amount: 100,
    currency: 'USD',
    timestamp: new Date().toISOString(),
    attendee_ref: 'att_default_2',
    status: 'confirmed',
  };
  const rawBody = JSON.stringify(payload);
  const signature = computeHmac(rawBody, confirmationService.getSharedSecret());
  const controller = createPaymentConfirmationRedirectController({});
  const response = controller.handle({ payload, rawBody, headers: { 'X-Signature': signature } });
  expect(response.status).toBe(200);
});

test('webhook controller maps invalid signature to 401', () => {
  const controller = createPaymentConfirmationWebhookController({
    confirmationService: stubService({ ok: false, result: 'rejected', reason: 'invalid_signature' }),
  });
  const response = controller.handle({ payload: {}, headers: {} });
  expect(response.status).toBe(401);
});

test('webhook controller maps status update failure to 500', () => {
  const controller = createPaymentConfirmationWebhookController({
    confirmationService: stubService({ ok: false, result: 'stored', reason: 'status_update_failed' }),
  });
  const response = controller.handle({ payload: {}, headers: {} });
  expect(response.status).toBe(500);
});

test('webhook controller maps duplicate with missing status to null', () => {
  const controller = createPaymentConfirmationWebhookController({
    confirmationService: stubService({ ok: true, result: 'duplicate' }),
  });
  const response = controller.handle({ payload: {}, headers: {} });
  expect(response.status).toBe(200);
  expect(response.body.registration_status).toBe(null);
});

test('webhook controller maps missing result to 401', () => {
  const controller = createPaymentConfirmationWebhookController({
    confirmationService: stubService(null),
  });
  const response = controller.handle({ payload: {}, headers: {} });
  expect(response.status).toBe(401);
});

test('webhook controller resolves signature header', () => {
  const confirmationService = { processConfirmation: jest.fn(() => ({ ok: true, result: 'stored' })) };
  const controller = createPaymentConfirmationWebhookController({ confirmationService });
  controller.handle({ payload: {}, headers: { 'x-signature': 'sig_w' } });
  expect(confirmationService.processConfirmation).toHaveBeenCalledWith(expect.objectContaining({ signature: 'sig_w' }));
});

test('webhook controller defaults missing headers to null signature', () => {
  const confirmationService = { processConfirmation: jest.fn(() => ({ ok: true, result: 'stored' })) };
  const controller = createPaymentConfirmationWebhookController({ confirmationService });
  controller.handle();
  expect(confirmationService.processConfirmation).toHaveBeenCalledWith(expect.objectContaining({ signature: null }));
});

test('webhook controller uses default service when omitted', () => {
  confirmationService.reset();
  confirmationService.saveOrder({
    order_id: 'ord_webhook',
    attendee_ref: 'att_webhook',
    amount: 100,
    currency: 'USD',
    status: 'pending',
  });
  const payload = {
    transaction_id: 'tx_webhook',
    order_id: 'ord_webhook',
    amount: 100,
    currency: 'USD',
    timestamp: new Date().toISOString(),
    attendee_ref: 'att_webhook',
    status: 'confirmed',
  };
  const rawBody = JSON.stringify(payload);
  const signature = computeHmac(rawBody, confirmationService.getSharedSecret());
  const controller = createPaymentConfirmationWebhookController();
  const response = controller.handle({ payload, rawBody, headers: { 'X-Signature': signature } });
  expect(response.status).toBe(200);
});

test('webhook controller defaults confirmation service for empty options', () => {
  confirmationService.reset();
  confirmationService.saveOrder({
    order_id: 'ord_webhook_2',
    attendee_ref: 'att_webhook_2',
    amount: 100,
    currency: 'USD',
    status: 'pending',
  });
  const payload = {
    transaction_id: 'tx_webhook_2',
    order_id: 'ord_webhook_2',
    amount: 100,
    currency: 'USD',
    timestamp: new Date().toISOString(),
    attendee_ref: 'att_webhook_2',
    status: 'confirmed',
  };
  const rawBody = JSON.stringify(payload);
  const signature = computeHmac(rawBody, confirmationService.getSharedSecret());
  const controller = createPaymentConfirmationWebhookController({});
  const response = controller.handle({ payload, rawBody, headers: { 'X-Signature': signature } });
  expect(response.status).toBe(200);
});
