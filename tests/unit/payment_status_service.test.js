import { paymentStatusService } from '../../src/services/payment_status_service.js';
import { paymentStorageService } from '../../src/services/payment_storage_service.js';

beforeEach(() => {
  paymentStorageService.reset();
});

test('payment status reports not found when missing', () => {
  const result = paymentStatusService.getPaymentStatus({ paymentId: 'missing' });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('not_found');
});

test('payment status reports missing payment when no id provided', () => {
  const result = paymentStatusService.getPaymentStatus();
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('missing_payment');
});

test('registration status reports not found when balance missing', () => {
  const result = paymentStatusService.getRegistrationStatus({ registrationId: 'reg_missing' });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('not_found');
});

test('registration status reports missing registration when no id provided', () => {
  const result = paymentStatusService.getRegistrationStatus();
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('missing_registration');
});

test('payment status returns payment and receipt', () => {
  paymentStorageService.savePayment({
    id: 'pay_1',
    registrationId: 'reg_1',
    amount: 100,
    status: 'captured',
    capturedAt: '2026-02-01T12:00:00.000Z',
    reference: 'ref_1',
  });
  paymentStorageService.saveReceipt({
    paymentId: 'pay_1',
    registrationId: 'reg_1',
    amount: 100,
    currency: 'USD',
    paidAt: '2026-02-01T12:00:00.000Z',
    reference: 'ref_1',
  });

  const result = paymentStatusService.getPaymentStatus({ paymentId: 'pay_1' });
  expect(result.ok).toBe(true);
  expect(result.receipt.reference).toBe('ref_1');
});
