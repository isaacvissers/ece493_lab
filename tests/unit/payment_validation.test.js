import { paymentValidationService } from '../../src/services/payment_validation_service.js';

test('payment validation reports missing required fields', () => {
  const result = paymentValidationService.validate();
  expect(result.ok).toBe(false);
  expect(result.errors.registrationId).toBe('required');
  expect(result.errors.cardNumber).toBe('required');
  expect(result.errors.cvv).toBe('required');
});

test('payment validation succeeds with required fields', () => {
  const result = paymentValidationService.validate({
    registrationId: 'reg_1',
    amount: 100,
    currency: 'USD',
    cardholderName: 'Ada Lovelace',
    cardNumber: '4242424242424242',
    expiryMonth: '11',
    expiryYear: '2030',
    cvv: '123',
    billingPostal: '12345',
    idempotencyKey: 'idem_1',
  });
  expect(result.ok).toBe(true);
});
