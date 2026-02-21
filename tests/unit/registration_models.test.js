import { jest } from '@jest/globals';
import { createRegistration } from '../../src/models/registration.js';
import { createRegistrationWindow } from '../../src/models/registration_window.js';
import { createPayment } from '../../src/models/payment.js';
import { createRegistrationLog } from '../../src/models/registration_log.js';

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2026-02-20T10:00:00.000Z'));
});

afterEach(() => {
  jest.useRealTimers();
});

test('creates registration with defaults', () => {
  const registration = createRegistration({ userId: 'user_1' });
  expect(registration.id).toContain('reg_');
  expect(registration.userId).toBe('user_1');
  expect(registration.status).toBe('PendingPayment');
  expect(registration.createdAt).toBe('2026-02-20T10:00:00.000Z');
});

test('creates registration with default inputs', () => {
  const registration = createRegistration();
  expect(registration.status).toBe('PendingPayment');
  expect(registration.userId).toBe(null);
});

test('creates registration with provided id', () => {
  const registration = createRegistration({ id: 'reg_custom', userId: 'user_2' });
  expect(registration.id).toBe('reg_custom');
});

test('creates registration with provided timestamps', () => {
  const registration = createRegistration({
    userId: 'user_3',
    createdAt: '2026-02-22T00:00:00.000Z',
    updatedAt: '2026-02-23T00:00:00.000Z',
  });
  expect(registration.createdAt).toBe('2026-02-22T00:00:00.000Z');
  expect(registration.updatedAt).toBe('2026-02-23T00:00:00.000Z');
});

test('creates registration window', () => {
  const window = createRegistrationWindow({ startAt: '2026-03-01', endAt: '2026-03-10', isOpen: true });
  expect(window.isOpen).toBe(true);
  expect(window.startAt).toBe('2026-03-01');
});

test('creates registration window with defaults', () => {
  const window = createRegistrationWindow();
  expect(window.isOpen).toBe(false);
});

test('creates payment record', () => {
  const payment = createPayment({ registrationId: 'reg_1', amount: 50, status: 'success' });
  expect(payment.id).toContain('pay_');
  expect(payment.registrationId).toBe('reg_1');
  expect(payment.status).toBe('success');
});

test('creates payment with provided id', () => {
  const payment = createPayment({ id: 'pay_custom', registrationId: 'reg_2' });
  expect(payment.id).toBe('pay_custom');
});

test('creates payment with defaults', () => {
  const payment = createPayment();
  expect(payment.status).toBe('pending');
});

test('creates registration log entry', () => {
  const log = createRegistrationLog({ registrationId: 'reg_2', event: 'save_failure', message: 'fail' });
  expect(log.id).toContain('reglog_');
  expect(log.event).toBe('save_failure');
  expect(log.message).toBe('fail');
});

test('creates registration log with provided id', () => {
  const log = createRegistrationLog({ id: 'log_custom', registrationId: 'reg_3' });
  expect(log.id).toBe('log_custom');
});

test('creates registration log with provided timestamp', () => {
  const log = createRegistrationLog({ registrationId: 'reg_4', timestamp: '2026-02-21T00:00:00.000Z' });
  expect(log.timestamp).toBe('2026-02-21T00:00:00.000Z');
});

test('creates registration log with defaults', () => {
  const log = createRegistrationLog();
  expect(log.event).toBe('save_failure');
});
