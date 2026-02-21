import { paymentService } from '../../src/services/payment_service.js';
import { paymentGatewayService } from '../../src/services/payment_gateway_service.js';
import { paymentStorageService } from '../../src/services/payment_storage_service.js';

beforeEach(() => {
  paymentService.reset();
  paymentGatewayService.reset();
  paymentStorageService.reset();
});

test('declined card returns failure without confirmation', () => {
  paymentGatewayService.setNextResult('declined');
  const result = paymentService.submitCardPayment({
    registrationId: 'reg_decline',
    amount: 120,
    currency: 'USD',
    cardholderName: 'Ada Lovelace',
    cardNumber: '4000000000000002',
    expiryMonth: '11',
    expiryYear: '2030',
    cvv: '123',
    billingPostal: '12345',
    idempotencyKey: 'idem_decline',
  });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('declined');
  const payment = paymentStorageService.getPaymentByRegistration('reg_decline');
  expect(payment.status).toBe('declined');
});

test('gateway timeout returns failure without confirmation', () => {
  paymentGatewayService.setNextResult('timeout');
  const result = paymentService.submitCardPayment({
    registrationId: 'reg_timeout',
    amount: 130,
    currency: 'USD',
    cardholderName: 'Ada Lovelace',
    cardNumber: '4242424242424242',
    expiryMonth: '11',
    expiryYear: '2030',
    cvv: '123',
    billingPostal: '12345',
    idempotencyKey: 'idem_timeout',
  });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('timeout');
  const payment = paymentStorageService.getPaymentByRegistration('reg_timeout');
  expect(payment.status).toBe('failed');
});

test('persistence failure flags reconciliation after approval', () => {
  const failingStorage = {
    ...paymentStorageService,
    savePayment(payment) {
      if (payment.status === 'captured') {
        throw new Error('storage_failure');
      }
      return paymentStorageService.savePayment(payment);
    },
  };

  const result = paymentService.submitCardPayment({
    registrationId: 'reg_persist',
    amount: 140,
    currency: 'USD',
    cardholderName: 'Ada Lovelace',
    cardNumber: '4242424242424242',
    expiryMonth: '11',
    expiryYear: '2030',
    cvv: '123',
    billingPostal: '12345',
    idempotencyKey: 'idem_persist',
    paymentStorageService: failingStorage,
  });

  expect(result.ok).toBe(false);
  expect(result.reason).toBe('persistence_failure');
});
