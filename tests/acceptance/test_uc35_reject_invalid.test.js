import { confirmationService } from '../../src/services/confirmation_service.js';
import { createPaymentConfirmationRedirectController } from '../../src/controllers/payment_confirmation_redirect_controller.js';
import { computeHmac } from '../../src/services/hmac.js';

beforeEach(() => {
  confirmationService.reset();
});

test('rejects invalid confirmations without updating status', () => {
  confirmationService.saveOrder({
    order_id: 'ord_invalid',
    attendee_ref: 'att_invalid',
    amount: 100,
    currency: 'USD',
    status: 'pending',
  });
  const payload = {
    transaction_id: 'tx_invalid',
    order_id: 'ord_invalid',
    amount: 90,
    currency: 'USD',
    timestamp: new Date().toISOString(),
    attendee_ref: 'att_invalid',
    status: 'confirmed',
  };
  const rawBody = JSON.stringify(payload);
  const signature = computeHmac(rawBody, confirmationService.getSharedSecret());
  const controller = createPaymentConfirmationRedirectController({ confirmationService });
  const response = controller.handle({ payload, rawBody, headers: { 'X-Signature': signature } });
  expect(response.status).toBe(400);
  expect(confirmationService.getConfirmations()).toHaveLength(0);
  expect(confirmationService.getOrder('ord_invalid').status).toBe('pending');
});
