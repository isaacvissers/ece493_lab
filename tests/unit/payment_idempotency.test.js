import { paymentService } from '../../src/services/payment_service.js';
import { paymentStorageService } from '../../src/services/payment_storage_service.js';

beforeEach(() => {
  paymentService.reset();
  paymentStorageService.reset();
});

test('duplicate idempotency key is rejected without duplicate charge', () => {
  const payload = {
    registrationId: 'reg_1',
    amount: 100,
    currency: 'USD',
    cardholderName: 'Ada Lovelace',
    cardNumber: '4242424242424242',
    expiryMonth: '11',
    expiryYear: '2030',
    cvv: '123',
    billingPostal: '12345',
    idempotencyKey: 'idem_dup',
  };

  const first = paymentService.submitCardPayment(payload);
  const second = paymentService.submitCardPayment(payload);

  expect(first.ok).toBe(true);
  expect(second.ok).toBe(false);
  expect(second.reason).toBe('duplicate');
  expect(paymentStorageService.getPayments()).toHaveLength(1);
});
