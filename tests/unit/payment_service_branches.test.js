import { paymentService } from '../../src/services/payment_service.js';
import { paymentGatewayService } from '../../src/services/payment_gateway_service.js';
import { paymentStorageService } from '../../src/services/payment_storage_service.js';

beforeEach(() => {
  paymentService.reset();
  paymentGatewayService.reset();
  paymentStorageService.reset();
});

test('submitCardPayment reports validation when inputs missing', () => {
  const result = paymentService.submitCardPayment();
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('validation');
});

test('submitCardPayment handles capture failures', () => {
  paymentGatewayService.setNextCaptureResult('error');
  const result = paymentService.submitCardPayment({
    registrationId: 'reg_capture',
    amount: 100,
    currency: 'USD',
    cardholderName: 'Ada Lovelace',
    cardNumber: '4242424242424242',
    expiryMonth: '11',
    expiryYear: '2030',
    cvv: '123',
    billingPostal: '12345',
    idempotencyKey: 'idem_capture',
  });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('error');
});

test('completeAuthentication reports not_found for missing payment', () => {
  const result = paymentService.completeAuthentication({ paymentId: 'missing' });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('not_found');
});

test('completeAuthentication reports not_found when called without args', () => {
  const result = paymentService.completeAuthentication();
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('not_found');
});

test('completeAuthentication reports auth_failed when authentication fails', () => {
  paymentStorageService.savePayment({
    id: 'pay_auth',
    registrationId: 'reg_auth',
    amount: 100,
    status: 'pending_confirmation',
  });
  paymentGatewayService.setAuthOutcome('pay_auth', false);
  const result = paymentService.completeAuthentication({ paymentId: 'pay_auth' });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('auth_failed');
});

test('submitCardPayment preserves existing reference when provided', () => {
  const stubStorage = {
    ...paymentStorageService,
    savePayment(payment) {
      if (payment.status === 'authorized') {
        return paymentStorageService.savePayment({ ...payment, reference: 'ref_existing' });
      }
      return paymentStorageService.savePayment(payment);
    },
  };
  const result = paymentService.submitCardPayment({
    registrationId: 'reg_ref',
    amount: 100,
    currency: 'USD',
    cardholderName: 'Ada Lovelace',
    cardNumber: '4242424242424242',
    expiryMonth: '11',
    expiryYear: '2030',
    cvv: '123',
    billingPostal: '12345',
    idempotencyKey: 'idem_ref',
    paymentStorageService: stubStorage,
  });
  expect(result.ok).toBe(true);
  expect(result.payment.reference).toBe('ref_existing');
});

test('submitCardPayment can skip card last4 when validation allows', () => {
  const validationService = { validate: () => ({ ok: true, errors: {} }) };
  const result = paymentService.submitCardPayment({
    registrationId: 'reg_nocard',
    amount: 100,
    currency: 'USD',
    cardholderName: 'Ada Lovelace',
    cardNumber: null,
    expiryMonth: '11',
    expiryYear: '2030',
    cvv: '123',
    billingPostal: '12345',
    idempotencyKey: 'idem_nocard',
    paymentValidationService: validationService,
  });
  expect(result.ok).toBe(true);
  const payment = paymentStorageService.getPaymentByRegistration('reg_nocard');
  expect(payment.cardLast4).toBe(null);
});

test('setPersistenceFailureMode forwards to storage service', () => {
  paymentService.setPersistenceFailureMode();
  paymentService.setPersistenceFailureMode(false);
});
