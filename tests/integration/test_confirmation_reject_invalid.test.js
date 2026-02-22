import { confirmationService } from '../../src/services/confirmation_service.js';
import { createPaymentConfirmationWebhookController } from '../../src/controllers/payment_confirmation_webhook_controller.js';
import { computeHmac } from '../../src/services/hmac.js';

beforeEach(() => {
  confirmationService.reset();
});

test('invalid confirmation is rejected', () => {
  confirmationService.saveOrder({
    order_id: 'ord_bad',
    attendee_ref: 'att_bad',
    amount: 60,
    currency: 'USD',
    status: 'pending',
  });
  const payload = {
    transaction_id: 'tx_bad',
    order_id: 'ord_bad',
    amount: 60,
    currency: 'EUR',
    timestamp: new Date().toISOString(),
    attendee_ref: 'att_bad',
    status: 'confirmed',
  };
  const rawBody = JSON.stringify(payload);
  const signature = computeHmac(rawBody, confirmationService.getSharedSecret());
  const controller = createPaymentConfirmationWebhookController({ confirmationService });
  const response = controller.handle({ payload, rawBody, headers: { 'X-Signature': signature } });
  expect(response.status).toBe(400);
});
