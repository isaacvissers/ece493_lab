import { confirmationService } from '../../src/services/confirmation_service.js';
import { createPaymentConfirmationWebhookController } from '../../src/controllers/payment_confirmation_webhook_controller.js';
import { computeHmac } from '../../src/services/hmac.js';

beforeEach(() => {
  confirmationService.reset();
});

test('exposes updated registration status after confirmation', () => {
  confirmationService.saveOrder({
    order_id: 'ord_200',
    attendee_ref: 'att_200',
    amount: 75,
    currency: 'USD',
    status: 'pending',
  });
  const payload = {
    transaction_id: 'tx_200',
    order_id: 'ord_200',
    amount: 75,
    currency: 'USD',
    timestamp: new Date().toISOString(),
    attendee_ref: 'att_200',
    status: 'confirmed',
  };
  const rawBody = JSON.stringify(payload);
  const signature = computeHmac(rawBody, confirmationService.getSharedSecret());
  const controller = createPaymentConfirmationWebhookController({ confirmationService });
  const response = controller.handle({ payload, rawBody, headers: { 'X-Signature': signature } });
  expect(response.body.registration_status).toBe('paid_confirmed');
  expect(confirmationService.getOrder('ord_200').status).toBe('paid_confirmed');
});
