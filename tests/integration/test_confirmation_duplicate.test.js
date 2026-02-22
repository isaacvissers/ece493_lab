import { confirmationService } from '../../src/services/confirmation_service.js';
import { createPaymentConfirmationWebhookController } from '../../src/controllers/payment_confirmation_webhook_controller.js';
import { computeHmac } from '../../src/services/hmac.js';

beforeEach(() => {
  confirmationService.reset();
});

test('duplicate confirmation returns duplicate result', () => {
  confirmationService.saveOrder({
    order_id: 'ord_dup2',
    attendee_ref: 'att_dup2',
    amount: 80,
    currency: 'USD',
    status: 'pending',
  });
  const payload = {
    transaction_id: 'tx_dup2',
    order_id: 'ord_dup2',
    amount: 80,
    currency: 'USD',
    timestamp: new Date().toISOString(),
    attendee_ref: 'att_dup2',
    status: 'confirmed',
  };
  const rawBody = JSON.stringify(payload);
  const signature = computeHmac(rawBody, confirmationService.getSharedSecret());
  const controller = createPaymentConfirmationWebhookController({ confirmationService });
  controller.handle({ payload, rawBody, headers: { 'X-Signature': signature } });
  const response = controller.handle({ payload, rawBody, headers: { 'X-Signature': signature } });
  expect(response.body.result).toBe('duplicate');
});
