import { confirmationService } from '../../src/services/confirmation_service.js';
import { createPaymentConfirmationRedirectController } from '../../src/controllers/payment_confirmation_redirect_controller.js';
import { computeHmac } from '../../src/services/hmac.js';

beforeEach(() => {
  confirmationService.reset();
});

test('stores valid confirmation and updates status', () => {
  confirmationService.saveOrder({
    order_id: 'ord_100',
    payment_intent_id: 'pi_100',
    attendee_ref: 'att_100',
    amount: 100,
    currency: 'USD',
    status: 'pending',
  });
  const payload = {
    transaction_id: 'tx_100',
    order_id: 'ord_100',
    payment_intent_id: 'pi_100',
    amount: 100,
    currency: 'USD',
    timestamp: new Date().toISOString(),
    attendee_ref: 'att_100',
    status: 'confirmed',
  };
  const rawBody = JSON.stringify(payload);
  const signature = computeHmac(rawBody, confirmationService.getSharedSecret());
  const controller = createPaymentConfirmationRedirectController({ confirmationService });
  const result = controller.handle({ payload, rawBody, headers: { 'X-Signature': signature } });
  expect(result.status).toBe(200);
  expect(confirmationService.getConfirmations()).toHaveLength(1);
  expect(confirmationService.getOrder('ord_100').status).toBe('paid_confirmed');
});
