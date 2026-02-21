import { jest } from '@jest/globals';
import { createPaymentStatusController } from '../../src/controllers/payment_status_controller.js';

function createViewStub() {
  return {
    status: null,
    data: null,
    setStatus(message) {
      this.status = message;
    },
    setPaymentStatus(data) {
      this.data = data;
    },
  };
}

test('payment status controller requires authentication', () => {
  const view = createViewStub();
  const onAuthRequired = jest.fn();
  const sessionState = { isAuthenticated: () => false };
  const controller = createPaymentStatusController({ view, sessionState, onAuthRequired });
  controller.show({ registrationId: 'reg_1' });
  expect(onAuthRequired).toHaveBeenCalled();
  expect(view.status).toContain('Please log in');
});

test('payment status controller handles unauthenticated without auth callback', () => {
  const view = createViewStub();
  const sessionState = { isAuthenticated: () => false };
  const controller = createPaymentStatusController({ view, sessionState });
  controller.show({ registrationId: 'reg_1' });
  expect(view.status).toContain('Please log in');
});

test('payment status controller shows not found message', () => {
  const view = createViewStub();
  const sessionState = { isAuthenticated: () => true };
  const paymentStatusService = {
    getRegistrationStatus: () => ({ ok: false, reason: 'not_found' }),
  };
  const controller = createPaymentStatusController({ view, sessionState, paymentStatusService });
  controller.show({ registrationId: 'reg_missing' });
  expect(view.status).toContain('not available');
});

test('payment status controller supports paymentId lookup', () => {
  const view = createViewStub();
  const sessionState = { isAuthenticated: () => true };
  const paymentStatusService = {
    getPaymentStatus: () => ({
      ok: true,
      payment: { registrationId: 'reg_1', status: 'captured', amount: 100, reference: 'ref_1' },
      receipt: { paidAt: '2026-02-01T12:00:00.000Z' },
    }),
  };
  const controller = createPaymentStatusController({ view, sessionState, paymentStatusService });
  controller.show({ paymentId: 'pay_1' });
  expect(view.data.status).toBe('captured');
});

test('payment status controller uses receipt amount when available', () => {
  const view = createViewStub();
  const sessionState = { isAuthenticated: () => true };
  const paymentStatusService = {
    getRegistrationStatus: () => ({
      ok: true,
      balance: { registrationId: 'reg_1', status: 'confirmed' },
      payment: { registrationId: 'reg_1', status: 'captured', amount: 75, reference: '' },
      receipt: { amount: 50, paidAt: '2026-02-01T12:00:00.000Z', reference: 'ref_50' },
    }),
  };
  const controller = createPaymentStatusController({ view, sessionState, paymentStatusService });
  controller.show({ registrationId: 'reg_1' });
  expect(view.data.amount).toBe('50');
  expect(view.data.reference).toBe('ref_50');
});

test('payment status controller falls back to payment amount when receipt missing', () => {
  const view = createViewStub();
  const sessionState = { isAuthenticated: () => true };
  const paymentStatusService = {
    getRegistrationStatus: () => ({
      ok: true,
      balance: { registrationId: 'reg_1', status: '' },
      payment: { registrationId: 'reg_1', status: 'captured', amount: 75, reference: '' },
      receipt: null,
    }),
  };
  const controller = createPaymentStatusController({ view, sessionState, paymentStatusService });
  controller.show({ registrationId: 'reg_1' });
  expect(view.data.amount).toBe('75');
  expect(view.data.reference).toBe('');
});

test('payment status controller uses payment capturedAt when receipt missing', () => {
  const view = createViewStub();
  const sessionState = { isAuthenticated: () => true };
  const paymentStatusService = {
    getRegistrationStatus: () => ({
      ok: true,
      balance: { registrationId: 'reg_1', status: '' },
      payment: { registrationId: 'reg_1', status: 'captured', amount: 75, capturedAt: '2026-02-01T12:00:00.000Z' },
      receipt: {},
    }),
  };
  const controller = createPaymentStatusController({ view, sessionState, paymentStatusService });
  controller.show({ registrationId: 'reg_1' });
  expect(view.data.paidAt).toBe('2026-02-01T12:00:00.000Z');
});

test('payment status controller handles empty data without crashing', () => {
  const view = createViewStub();
  const sessionState = { isAuthenticated: () => true };
  const paymentStatusService = {
    getRegistrationStatus: () => ({
      ok: true,
      balance: {},
      payment: {},
      receipt: {},
    }),
  };
  const controller = createPaymentStatusController({ view, sessionState, paymentStatusService });
  controller.show({ registrationId: 'reg_1' });
  expect(view.data.registrationId).toBe('');
  expect(view.data.status).toBe('');
  expect(view.data.amount).toBe('');
  expect(view.data.paidAt).toBe('');
  expect(view.data.reference).toBe('');
});

test('payment status controller handles missing payment object', () => {
  const view = createViewStub();
  const sessionState = { isAuthenticated: () => true };
  const paymentStatusService = {
    getRegistrationStatus: () => ({
      ok: true,
      balance: { registrationId: 'reg_1', status: 'confirmed' },
      payment: null,
      receipt: {},
    }),
  };
  const controller = createPaymentStatusController({ view, sessionState, paymentStatusService });
  controller.show({ registrationId: 'reg_1' });
  expect(view.data.registrationId).toBe('reg_1');
});

test('payment status controller can be created with default args', () => {
  const controller = createPaymentStatusController();
  expect(controller.view).toBe(undefined);
});
test('payment status controller prefers balance status when available', () => {
  const view = createViewStub();
  const sessionState = { isAuthenticated: () => true };
  const paymentStatusService = {
    getRegistrationStatus: () => ({
      ok: true,
      balance: { registrationId: 'reg_1', status: 'confirmed' },
      payment: { registrationId: 'reg_1', status: 'captured', amount: 100 },
      receipt: { paidAt: '2026-02-01T12:00:00.000Z', reference: 'ref_1' },
    }),
  };
  const controller = createPaymentStatusController({ view, sessionState, paymentStatusService });
  controller.show({ registrationId: 'reg_1' });
  expect(view.data.status).toBe('confirmed');
});

test('payment status controller handles missing identifiers', () => {
  const view = createViewStub();
  const sessionState = { isAuthenticated: () => true };
  const paymentStatusService = {
    getRegistrationStatus: () => ({ ok: false, reason: 'missing_registration' }),
  };
  const controller = createPaymentStatusController({ view, sessionState, paymentStatusService });
  controller.show();
  expect(view.status).toContain('not available');
});

test('payment status controller handles missing paymentId lookup', () => {
  const view = createViewStub();
  const sessionState = { isAuthenticated: () => true };
  const paymentStatusService = {
    getPaymentStatus: () => ({ ok: false, reason: 'missing_payment' }),
  };
  const controller = createPaymentStatusController({ view, sessionState, paymentStatusService });
  controller.show({ paymentId: 'pay_missing' });
  expect(view.status).toContain('not available');
});
