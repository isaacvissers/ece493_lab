import { registrationService } from '../../src/services/registration_service.js';
import { registrationWindowService } from '../../src/services/registration_window_service.js';
import { paymentService } from '../../src/services/payment_service.js';
import { notificationService } from '../../src/services/notification_service.js';
import { registrationLogService } from '../../src/services/registration_log_service.js';

beforeEach(() => {
  registrationService.reset();
  registrationWindowService.reset();
  paymentService.reset();
  notificationService.reset();
  registrationLogService.reset();
  const startAt = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const endAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
  registrationWindowService.setWindow({ startAt, endAt });
});

test('returns validation errors when required fields missing', () => {
  const result = registrationService.submitRegistration({
    userId: 'user_1',
    values: { name: '', affiliation: '', contactEmail: '', attendanceType: '' },
  });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('validation');
  expect(result.errors.name).toBe('required');
  expect(result.errors.contactEmail).toBe('required');
});

test('returns invalid email error', () => {
  const result = registrationService.submitRegistration({
    userId: 'user_1',
    values: {
      name: 'Ada',
      affiliation: 'Lab',
      contactEmail: 'invalid',
      attendanceType: 'virtual',
    },
  });
  expect(result.ok).toBe(false);
  expect(result.errors.contactEmail).toBe('invalid');
});

test('returns duplicate when user already registered', () => {
  paymentService.setRegistrationFee(0);
  const first = registrationService.submitRegistration({
    userId: 'user_1',
    values: {
      name: 'Ada',
      affiliation: 'Lab',
      contactEmail: 'ada@example.com',
      attendanceType: 'virtual',
    },
  });
  expect(first.ok).toBe(true);
  const second = registrationService.submitRegistration({
    userId: 'user_1',
    values: {
      name: 'Ada',
      affiliation: 'Lab',
      contactEmail: 'ada@example.com',
      attendanceType: 'virtual',
    },
  });
  expect(second.ok).toBe(false);
  expect(second.reason).toBe('duplicate');
  expect(second.registration.id).toBe(first.registration.id);
});

test('returns payment error when payment service cannot process', () => {
  const paymentStub = {
    getRegistrationFee: () => 10,
    processPayment: () => ({ ok: false, reason: 'missing_registration' }),
    getPayment: () => null,
  };
  const result = registrationService.submitRegistration({
    userId: 'user_stub',
    values: {
      name: 'Ada',
      affiliation: 'Lab',
      contactEmail: 'ada@example.com',
      attendanceType: 'virtual',
    },
    paymentService: paymentStub,
  });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('payment_error');
});

test('retry payment returns already registered for completed registration', () => {
  paymentService.setRegistrationFee(0);
  const result = registrationService.submitRegistration({
    userId: 'user_1',
    values: {
      name: 'Ada',
      affiliation: 'Lab',
      contactEmail: 'ada@example.com',
      attendanceType: 'virtual',
    },
  });
  expect(result.ok).toBe(true);
  const retry = registrationService.retryPayment({ userId: 'user_1' });
  expect(retry.ok).toBe(true);
  expect(retry.alreadyRegistered).toBe(true);
});

test('retry payment returns not_found when no registration exists', () => {
  const retry = registrationService.retryPayment({ userId: 'missing_user' });
  expect(retry.ok).toBe(false);
  expect(retry.reason).toBe('not_found');
});

test('retry payment reports failure when payment retry fails', () => {
  paymentService.setFailureMode({ initial: true, retry: true });
  const first = registrationService.submitRegistration({
    userId: 'user_pay',
    values: {
      name: 'Ada',
      affiliation: 'Lab',
      contactEmail: 'ada@example.com',
      attendanceType: 'virtual',
    },
  });
  expect(first.ok).toBe(false);
  const retry = registrationService.retryPayment({ userId: 'user_pay' });
  expect(retry.ok).toBe(false);
  expect(retry.reason).toBe('payment_failed');
});

test('retry payment logs save failures', () => {
  paymentService.setFailureMode({ initial: true, retry: false });
  registrationService.submitRegistration({
    userId: 'user_retry_save',
    values: {
      name: 'Ada',
      affiliation: 'Lab',
      contactEmail: 'ada@example.com',
      attendanceType: 'virtual',
    },
  });
  registrationService.setFailureMode(true);
  const retry = registrationService.retryPayment({ userId: 'user_retry_save' });
  expect(retry.ok).toBe(false);
  expect(retry.reason).toBe('save_failed');
  const logs = registrationLogService.getLogs();
  expect(logs[logs.length - 1].event).toBe('save_failure');
});

test('logs save failures when storage fails', () => {
  registrationService.setFailureMode(true);
  const result = registrationService.submitRegistration({
    userId: 'user_2',
    values: {
      name: 'Grace',
      affiliation: 'Lab',
      contactEmail: 'grace@example.com',
      attendanceType: 'in_person',
    },
  });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('save_failed');
  const logs = registrationLogService.getLogs();
  expect(logs[0].event).toBe('save_failure');
});
