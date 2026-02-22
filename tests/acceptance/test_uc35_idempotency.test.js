import { confirmationService } from '../../src/services/confirmation_service.js';
import { createPaymentConfirmationRedirectController } from '../../src/controllers/payment_confirmation_redirect_controller.js';
import { computeHmac } from '../../src/services/hmac.js';

beforeEach(() => {
  confirmationService.reset();
});

test('duplicate confirmations are acknowledged without duplicates', () => {
  confirmationService.saveOrder({
    order_id: 'ord_dup',
    attendee_ref: 'att_dup',
    amount: 100,
    currency: 'USD',
    status: 'pending',
  });
  const payload = {
    transaction_id: 'tx_dup',
    order_id: 'ord_dup',
    amount: 100,
    currency: 'USD',
    timestamp: new Date().toISOString(),
    attendee_ref: 'att_dup',
    status: 'confirmed',
  };
  const rawBody = JSON.stringify(payload);
  const signature = computeHmac(rawBody, confirmationService.getSharedSecret());
  const controller = createPaymentConfirmationRedirectController({ confirmationService });
  controller.handle({ payload, rawBody, headers: { 'X-Signature': signature } });
  const duplicate = controller.handle({ payload, rawBody, headers: { 'X-Signature': signature } });
  expect(duplicate.body.result).toBe('duplicate');
  expect(confirmationService.getConfirmations()).toHaveLength(1);
});
