import { paymentStorageService } from '../../src/services/payment_storage_service.js';

beforeEach(() => {
  paymentStorageService.reset();
});

test('payment storage strips sensitive card data', () => {
  paymentStorageService.savePayment({
    id: 'pay_safe',
    registrationId: 'reg_safe',
    amount: 100,
    status: 'authorized',
    cardNumber: '4242424242424242',
    cvv: '123',
    expiryMonth: '11',
    expiryYear: '2030',
    billingPostal: '12345',
  });

  const stored = paymentStorageService.getPayment('pay_safe');
  expect(stored.cardNumber).toBeUndefined();
  expect(stored.cvv).toBeUndefined();
  expect(stored.cardLast4).toBe('4242');
});
