import { confirmationService } from '../../src/services/confirmation_service.js';
import { createPaymentConfirmationWebhookController } from '../../src/controllers/payment_confirmation_webhook_controller.js';

beforeEach(() => {
  confirmationService.reset();
});

test('webhook confirmation rejects missing signature', () => {
  confirmationService.saveOrder({
    order_id: 'ord_hook',
    attendee_ref: 'att_hook',
    amount: 50,
    currency: 'USD',
    status: 'pending',
  });
  const payload = {
    transaction_id: 'tx_hook',
    order_id: 'ord_hook',
    amount: 50,
    currency: 'USD',
    timestamp: new Date().toISOString(),
    attendee_ref: 'att_hook',
    status: 'confirmed',
  };
  const controller = createPaymentConfirmationWebhookController({ confirmationService });
  const response = controller.handle({ payload, rawBody: JSON.stringify(payload), headers: {} });
  expect(response.status).toBe(401);
});
