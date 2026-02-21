import { paymentService } from '../../src/services/payment_service.js';

beforeEach(() => {
  paymentService.reset();
});

test('fails when registrationId missing', () => {
  const result = paymentService.processPayment();
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('missing_registration');
});

test('setFailureMode defaults to false flags', () => {
  paymentService.setFailureMode();
  const result = paymentService.processPayment({ registrationId: 'reg_default', amount: 10 });
  expect(result.ok).toBe(true);
});

test('marks payment not required when fee is zero', () => {
  paymentService.setRegistrationFee(0);
  const result = paymentService.processPayment({ registrationId: 'reg_1' });
  expect(result.ok).toBe(true);
  expect(result.payment.status).toBe('not_required');
});

test('handles payment failure and retry', () => {
  paymentService.setFailureMode({ initial: true, retry: false });
  const initial = paymentService.processPayment({ registrationId: 'reg_2', amount: 50 });
  expect(initial.ok).toBe(false);
  expect(initial.payment.status).toBe('failure');
  const retried = paymentService.retryPayment({ registrationId: 'reg_2' });
  expect(retried.ok).toBe(true);
  expect(retried.payment.status).toBe('success');
});

test('returns already paid when retrying non-failed payment', () => {
  paymentService.setRegistrationFee(0);
  paymentService.processPayment({ registrationId: 'reg_3' });
  const retry = paymentService.retryPayment({ registrationId: 'reg_3' });
  expect(retry.ok).toBe(true);
  expect(retry.alreadyPaid).toBe(true);
});

test('returns not_found when retrying missing payment', () => {
  const result = paymentService.retryPayment({ registrationId: 'missing' });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('not_found');
});

test('returns missing_registration when retrying without id', () => {
  const result = paymentService.retryPayment();
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('missing_registration');
});

test('ignores non-numeric registration fees', () => {
  paymentService.setRegistrationFee(25);
  paymentService.setRegistrationFee('invalid');
  expect(paymentService.getRegistrationFee()).toBe(25);
});

test('retry can fail when retry failure mode enabled', () => {
  paymentService.setFailureMode({ initial: true, retry: true });
  paymentService.processPayment({ registrationId: 'reg_4', amount: 20 });
  const retry = paymentService.retryPayment({ registrationId: 'reg_4' });
  expect(retry.ok).toBe(false);
  expect(retry.payment.status).toBe('failure');
});
