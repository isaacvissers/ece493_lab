import { confirmationService } from '../../src/services/confirmation_service.js';
import { retryQueue } from '../../src/services/retry_queue.js';
import { createPaymentConfirmationRedirectController } from '../../src/controllers/payment_confirmation_redirect_controller.js';
import { computeHmac } from '../../src/services/hmac.js';

beforeEach(() => {
  confirmationService.reset();
  retryQueue.reset();
});

test('status update failure enqueues retry', () => {
  confirmationService.saveOrder({
    order_id: 'ord_retry',
    attendee_ref: 'att_retry',
    amount: 30,
    currency: 'USD',
    status: 'pending',
  });
  confirmationService.setFailureMode({ statusUpdate: true });
  const payload = {
    transaction_id: 'tx_retry',
    order_id: 'ord_retry',
    amount: 30,
    currency: 'USD',
    timestamp: new Date().toISOString(),
    attendee_ref: 'att_retry',
    status: 'confirmed',
  };
  const rawBody = JSON.stringify(payload);
  const signature = computeHmac(rawBody, confirmationService.getSharedSecret());
  const controller = createPaymentConfirmationRedirectController({ confirmationService });
  const response = controller.handle({ payload, rawBody, headers: { 'X-Signature': signature } });
  expect(response.status).toBe(500);
  const entries = retryQueue.getAll();
  expect(entries).toHaveLength(1);
  expect(entries[0].transaction_id).toBe('tx_retry');
});
