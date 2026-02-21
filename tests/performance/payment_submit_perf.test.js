import { paymentService } from '../../src/services/payment_service.js';

beforeEach(() => {
  paymentService.reset();
});

test('payment submission responds within 200 ms', () => {
  const start = Date.now();
  const result = paymentService.submitCardPayment({
    registrationId: 'reg_perf',
    amount: 150,
    currency: 'USD',
    cardholderName: 'Ada Lovelace',
    cardNumber: '4242424242424242',
    expiryMonth: '11',
    expiryYear: '2030',
    cvv: '123',
    billingPostal: '12345',
    idempotencyKey: 'idem_perf',
  });
  const elapsed = Date.now() - start;
  expect(result.ok).toBe(true);
  expect(elapsed).toBeLessThan(200);
});
