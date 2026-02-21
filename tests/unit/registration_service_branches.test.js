import { registrationService, __testOnly } from '../../src/services/registration_service.js';
import { registrationWindowService } from '../../src/services/registration_window_service.js';
import { paymentService } from '../../src/services/payment_service.js';
import { notificationService } from '../../src/services/notification_service.js';
import { registrationLogService } from '../../src/services/registration_log_service.js';
import { registrationStorage } from '../../src/services/storage.js';

const OPEN_WINDOW_MS = 60 * 60 * 1000;

function setOpenWindow() {
  const now = Date.now();
  registrationWindowService.setWindow({
    startAt: new Date(now - OPEN_WINDOW_MS).toISOString(),
    endAt: new Date(now + OPEN_WINDOW_MS).toISOString(),
  });
}

beforeEach(() => {
  registrationService.reset();
  registrationWindowService.reset();
  paymentService.reset();
  notificationService.reset();
  registrationLogService.reset();
  registrationStorage.clearAll();
  setOpenWindow();
});

test('exposes helpers for validation and receipts', () => {
  const validation = __testOnly.validateRegistration();
  expect(validation.ok).toBe(false);
  expect(validation.errors.contactEmail).toBe('required');

  expect(__testOnly.isValidEmail('')).toBe(false);
  expect(__testOnly.isValidEmail('ada@example.com')).toBe(true);

  expect(__testOnly.buildReceipt(null, null)).toBeNull();
  const baseRegistration = {
    name: 'Ada',
    affiliation: 'Lab',
    attendanceType: 'virtual',
    status: 'Registered',
  };
  expect(__testOnly.buildReceipt(baseRegistration, { status: 'not_required' }).paymentStatus)
    .toBe('not_required');
  expect(__testOnly.buildReceipt(baseRegistration, { status: 'success' }).paymentStatus)
    .toBe('succeeded');
  expect(__testOnly.buildReceipt(baseRegistration, { status: 'failure' }).paymentStatus)
    .toBe('failed');
  expect(__testOnly.buildReceipt(baseRegistration, null).paymentStatus)
    .toBe('pending');
});

test('finds registrations by id and returns null for missing entries', () => {
  registrationStorage.write('cms.registrations', [
    null,
    { id: 'reg_a', userId: 'user_a' },
  ]);
  expect(__testOnly.findRegistrationById('reg_a').id).toBe('reg_a');
  expect(__testOnly.findRegistrationById('missing')).toBeNull();
});

test('returns not_found when requesting status without a registration', () => {
  const status = registrationService.getRegistrationStatus();
  expect(status.ok).toBe(false);
  expect(status.reason).toBe('not_found');
});

test('returns status with receipt when registration exists', () => {
  paymentService.setRegistrationFee(0);
  const created = registrationService.submitRegistration({
    userId: 'user_status',
    values: {
      name: 'Ada',
      affiliation: 'Lab',
      contactEmail: 'ada@example.com',
      attendanceType: 'virtual',
    },
  });
  const paymentStub = {
    getPayment: () => ({ status: 'success' }),
  };
  const status = registrationService.getRegistrationStatus({
    userId: 'user_status',
    paymentService: paymentStub,
  });
  expect(status.ok).toBe(true);
  expect(status.registration.id).toBe(created.registration.id);
  expect(status.receipt.paymentStatus).toBe('succeeded');
});

test('rejects submit with no arguments', () => {
  const result = registrationService.submitRegistration();
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('unauthenticated');
});

test('returns closed when window not open and supports numeric now', () => {
  registrationWindowService.setWindow({
    startAt: '2026-03-01T00:00:00.000Z',
    endAt: '2026-03-10T00:00:00.000Z',
  });
  const result = registrationService.submitRegistration({
    userId: 'user_closed',
    now: Date.parse('2026-02-01T00:00:00.000Z'),
    values: {
      name: 'Ada',
      affiliation: 'Lab',
      contactEmail: 'ada@example.com',
      attendanceType: 'virtual',
    },
  });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('closed');
});

test('handles invalid now timestamps by falling back to Date.now()', () => {
  paymentService.setRegistrationFee(0);
  const result = registrationService.submitRegistration({
    userId: 'user_now',
    now: 'invalid',
    values: {
      name: 'Grace',
      affiliation: 'Lab',
      contactEmail: 'grace@example.com',
      attendanceType: 'virtual',
    },
  });
  expect(result.ok).toBe(true);
});

test('returns payment_failed with null payment when payment service omits payment', () => {
  const paymentStub = {
    getRegistrationFee: () => 25,
    processPayment: () => ({ ok: false, reason: 'payment_failed' }),
    getPayment: () => null,
  };
  const result = registrationService.submitRegistration({
    userId: 'user_pay',
    values: {
      name: 'Ada',
      affiliation: 'Lab',
      contactEmail: 'ada@example.com',
      attendanceType: 'virtual',
    },
    paymentService: paymentStub,
  });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('payment_failed');
  expect(result.payment).toBeNull();
});

test('logs save_failed when pending registration cannot be persisted', () => {
  const originalWrite = registrationStorage.write;
  registrationStorage.write = (...args) => {
    registrationStorage.write = originalWrite;
    throw {};
  };
  const paymentStub = {
    getRegistrationFee: () => 50,
    processPayment: () => ({ ok: false, reason: 'payment_failed', payment: { status: 'failure' } }),
    getPayment: () => null,
  };
  const result = registrationService.submitRegistration({
    userId: 'user_fail',
    values: {
      name: 'Ada',
      affiliation: 'Lab',
      contactEmail: 'ada@example.com',
      attendanceType: 'virtual',
    },
    paymentService: paymentStub,
  });
  registrationStorage.write = originalWrite;
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('save_failed');
  expect(registrationLogService.getLogs().slice(-1)[0].message).toBe('save_failed');
});

test('logs save failures with error message when pending registration cannot be persisted', () => {
  paymentService.setFailureMode({ initial: true, retry: false });
  registrationService.setFailureMode(true);
  const result = registrationService.submitRegistration({
    userId: 'user_pending_error',
    values: {
      name: 'Ada',
      affiliation: 'Lab',
      contactEmail: 'ada@example.com',
      attendanceType: 'virtual',
    },
  });
  registrationService.setFailureMode(false);
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('save_failed');
  expect(registrationLogService.getLogs().slice(-1)[0].message).toBe('storage_failure');
});

test('logs save_failed when completed registration cannot be persisted', () => {
  const originalWrite = registrationStorage.write;
  registrationStorage.write = (...args) => {
    registrationStorage.write = originalWrite;
    throw {};
  };
  const paymentStub = {
    getRegistrationFee: () => 0,
    processPayment: () => ({ ok: true, payment: { status: 'success' } }),
    getPayment: () => null,
  };
  const result = registrationService.submitRegistration({
    userId: 'user_complete',
    values: {
      name: 'Ada',
      affiliation: 'Lab',
      contactEmail: 'ada@example.com',
      attendanceType: 'virtual',
    },
    paymentService: paymentStub,
  });
  registrationStorage.write = originalWrite;
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('save_failed');
  expect(registrationLogService.getLogs().slice(-1)[0].message).toBe('save_failed');
});

test('logs notification failures with default reason on submit', () => {
  paymentService.setRegistrationFee(0);
  const notificationStub = {
    sendRegistrationConfirmation: () => ({ ok: false }),
  };
  const result = registrationService.submitRegistration({
    userId: 'user_notify',
    values: {
      name: 'Ada',
      affiliation: 'Lab',
      contactEmail: 'ada@example.com',
      attendanceType: 'virtual',
    },
    notificationService: notificationStub,
  });
  expect(result.ok).toBe(true);
  expect(registrationLogService.getLogs().slice(-1)[0].message).toBe('notification_failed');
});

test('retryPayment returns not_found when called without args', () => {
  const result = registrationService.retryPayment();
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('not_found');
});

test('retryPayment reports payment_failed when retry has no reason or payment', () => {
  paymentService.setRegistrationFee(0);
  registrationService.submitRegistration({
    userId: 'user_retry',
    values: {
      name: 'Ada',
      affiliation: 'Lab',
      contactEmail: 'ada@example.com',
      attendanceType: 'virtual',
    },
  });
  const paymentStub = {
    retryPayment: () => ({ ok: false }),
  };
  const result = registrationService.retryPayment({
    userId: 'user_retry',
    paymentService: paymentStub,
  });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('payment_failed');
  expect(result.payment).toBeNull();
});

test('retryPayment logs save_failed when update cannot be persisted', () => {
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
  const originalWrite = registrationStorage.write;
  registrationStorage.write = (...args) => {
    registrationStorage.write = originalWrite;
    throw {};
  };
  const paymentStub = {
    retryPayment: () => ({ ok: true, payment: { status: 'success' } }),
  };
  const result = registrationService.retryPayment({
    userId: 'user_retry_save',
    paymentService: paymentStub,
  });
  registrationStorage.write = originalWrite;
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('save_failed');
  expect(registrationLogService.getLogs().slice(-1)[0].message).toBe('save_failed');
});

test('retryPayment logs notification failure with default reason', () => {
  paymentService.setFailureMode({ initial: true, retry: false });
  registrationService.submitRegistration({
    userId: 'user_retry_notify',
    values: {
      name: 'Ada',
      affiliation: 'Lab',
      contactEmail: 'ada@example.com',
      attendanceType: 'virtual',
    },
  });
  const notificationStub = {
    sendRegistrationConfirmation: () => ({ ok: false }),
  };
  const result = registrationService.retryPayment({
    userId: 'user_retry_notify',
    notificationService: notificationStub,
  });
  expect(result.ok).toBe(true);
  expect(registrationLogService.getLogs().slice(-1)[0].message).toBe('notification_failed');
});
