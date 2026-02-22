import { confirmationService } from '../../src/services/confirmation_service.js';
import { reconciliationQueue } from '../../src/services/reconciliation_queue.js';
import { createPaymentConfirmationRedirectController } from '../../src/controllers/payment_confirmation_redirect_controller.js';
import { computeHmac } from '../../src/services/hmac.js';

beforeEach(() => {
  confirmationService.reset();
  reconciliationQueue.reset();
});

test('storage failure queues confirmation for reconciliation', () => {
  confirmationService.saveOrder({
    order_id: 'ord_fail',
    attendee_ref: 'att_fail',
    amount: 100,
    currency: 'USD',
    status: 'pending',
  });
  confirmationService.setFailureMode({ confirmationStorage: true });
  const payload = {
    transaction_id: 'tx_fail',
    order_id: 'ord_fail',
    amount: 100,
    currency: 'USD',
    timestamp: new Date().toISOString(),
    attendee_ref: 'att_fail',
    status: 'confirmed',
  };
  const rawBody = JSON.stringify(payload);
  const signature = computeHmac(rawBody, confirmationService.getSharedSecret());
  const controller = createPaymentConfirmationRedirectController({ confirmationService });
  const response = controller.handle({ payload, rawBody, headers: { 'X-Signature': signature } });
  expect(response.status).toBe(500);
  expect(reconciliationQueue.getAll()).toHaveLength(1);
});
