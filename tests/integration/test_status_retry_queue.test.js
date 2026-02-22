import { confirmationService } from '../../src/services/confirmation_service.js';
import { retryQueue } from '../../src/services/retry_queue.js';
import { computeHmac } from '../../src/services/hmac.js';

beforeEach(() => {
  confirmationService.reset();
  retryQueue.reset();
});

test('status update failure enqueues retry entry', () => {
  confirmationService.saveOrder({
    order_id: 'ord_retry2',
    attendee_ref: 'att_retry2',
    amount: 42,
    currency: 'USD',
    status: 'pending',
  });
  confirmationService.setFailureMode({ statusUpdate: true });
  const payload = {
    transaction_id: 'tx_retry2',
    order_id: 'ord_retry2',
    amount: 42,
    currency: 'USD',
    timestamp: new Date().toISOString(),
    attendee_ref: 'att_retry2',
    status: 'confirmed',
  };
  const rawBody = JSON.stringify(payload);
  const signature = computeHmac(rawBody, confirmationService.getSharedSecret());
  const result = confirmationService.processConfirmation({
    payload,
    rawBody,
    signature,
    sourceChannel: 'webhook',
  });
  expect(result.ok).toBe(false);
  const entries = retryQueue.getAll();
  expect(entries).toHaveLength(1);
  expect(entries[0].attempt).toBe(1);
});
