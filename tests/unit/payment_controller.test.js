import { jest } from '@jest/globals';
import { createPaymentController } from '../../src/controllers/payment_controller.js';

function createViewStub() {
  return {
    status: null,
    errors: {},
    setStatus(message) {
      this.status = message;
    },
    setFieldError(field, message) {
      this.errors[field] = message;
    },
    clearErrors() {
      this.errors = {};
    },
    setReceipt() {},
    onSubmit() {},
    onCancel() {},
    getValues() {
      return {
        cardholderName: 'Ada Lovelace',
        cardNumber: '4242424242424242',
        expiryMonth: '11',
        expiryYear: '2030',
        cvv: '123',
        billingPostal: '12345',
      };
    },
  };
}

test('payment controller requires authentication', () => {
  const view = createViewStub();
  const onAuthRequired = jest.fn();
  const sessionState = { isAuthenticated: () => false, getCurrentUser: () => ({}) };
  const controller = createPaymentController({ view, sessionState, onAuthRequired });
  controller.show({ registrationId: 'reg_1', amount: 100 });
  controller.submit({ preventDefault: () => {} });
  expect(onAuthRequired).toHaveBeenCalled();
  expect(view.status).toContain('Please log in');
});

test('payment controller reports validation errors', () => {
  const view = createViewStub();
  const paymentService = {
    submitCardPayment: () => ({ ok: false, reason: 'validation', errors: { cardNumber: 'required' } }),
  };
  const sessionState = { isAuthenticated: () => true, getCurrentUser: () => ({}) };
  const controller = createPaymentController({ view, paymentService, sessionState });
  controller.show({ registrationId: 'reg_1', amount: 100 });
  controller.submit({ preventDefault: () => {} });
  expect(view.errors.cardNumber).toContain('required');
});

test('payment controller handles non-required validation errors', () => {
  const view = createViewStub();
  const paymentService = {
    submitCardPayment: () => ({ ok: false, reason: 'validation', errors: { cardNumber: 'invalid' } }),
  };
  const sessionState = { isAuthenticated: () => true, getCurrentUser: () => ({}) };
  const controller = createPaymentController({ view, paymentService, sessionState });
  controller.show({ registrationId: 'reg_1', amount: 100 });
  controller.submit({ preventDefault: () => {} });
  expect(view.errors.cardNumber).toContain('valid');
});

test('payment controller handles validation with missing error details', () => {
  const view = createViewStub();
  const paymentService = {
    submitCardPayment: () => ({ ok: false, reason: 'validation' }),
  };
  const sessionState = { isAuthenticated: () => true, getCurrentUser: () => ({}) };
  const controller = createPaymentController({ view, paymentService, sessionState });
  controller.show({ registrationId: 'reg_1', amount: 100 });
  controller.submit({ preventDefault: () => {} });
  expect(view.status).toContain('Fix highlighted');
});

test('payment controller handles auth-required responses', () => {
  const view = createViewStub();
  const paymentService = {
    submitCardPayment: () => ({ ok: false, reason: 'auth_required', payment: { id: 'pay_1' } }),
  };
  const sessionState = { isAuthenticated: () => true, getCurrentUser: () => ({}) };
  const controller = createPaymentController({ view, paymentService, sessionState });
  controller.show({ registrationId: 'reg_1', amount: 100 });
  controller.submit({ preventDefault: () => {} });
  expect(view.status).toContain('Additional authentication required');
});

test('payment controller handles auth-required without payment id', () => {
  const view = createViewStub();
  const paymentService = {
    submitCardPayment: () => ({ ok: false, reason: 'auth_required' }),
    completeAuthentication: jest.fn(),
  };
  const sessionState = { isAuthenticated: () => true, getCurrentUser: () => ({}) };
  const controller = createPaymentController({ view, paymentService, sessionState });
  controller.show({ registrationId: 'reg_1', amount: 100 });
  controller.submit({ preventDefault: () => {} });
  controller.completeAuthentication();
  expect(paymentService.completeAuthentication).not.toHaveBeenCalled();
});

test('payment controller uses error view for persistence failures', () => {
  const view = createViewStub();
  const errorView = { setMessage: jest.fn() };
  const paymentService = {
    submitCardPayment: () => ({ ok: false, reason: 'persistence_failure', payment: { id: 'pay_1' } }),
  };
  const sessionState = { isAuthenticated: () => true, getCurrentUser: () => ({}) };
  const controller = createPaymentController({ view, errorView, paymentService, sessionState });
  controller.show({ registrationId: 'reg_1', amount: 100 });
  controller.submit({ preventDefault: () => {} });
  expect(errorView.setMessage).toHaveBeenCalled();
  expect(controller.view).toBe(errorView);
});

test('payment controller handles generic failure with custom message', () => {
  const view = createViewStub();
  const errorView = { setMessage: jest.fn() };
  const paymentService = {
    submitCardPayment: () => ({ ok: false, reason: 'error' }),
  };
  const sessionState = { isAuthenticated: () => true, getCurrentUser: () => ({}) };
  const controller = createPaymentController({ view, errorView, paymentService, sessionState });
  controller.show({ registrationId: 'reg_1', amount: 100 });
  controller.submit();
  expect(errorView.setMessage).toHaveBeenCalledWith('Payment could not be processed. Please try again.');
});

test('payment controller handles generic failures without error view', () => {
  const view = createViewStub();
  const paymentService = {
    submitCardPayment: () => ({ ok: false, reason: 'declined' }),
  };
  const sessionState = { isAuthenticated: () => true, getCurrentUser: () => ({}) };
  const controller = createPaymentController({ view, paymentService, sessionState });
  controller.show({ registrationId: 'reg_1', amount: 100 });
  controller.submit();
  expect(view.status).toContain('Payment could not be processed');
});

test('payment controller handles unauthenticated without auth callback', () => {
  const view = createViewStub();
  const sessionState = { isAuthenticated: () => false, getCurrentUser: () => ({}) };
  const controller = createPaymentController({ view, sessionState });
  controller.submit();
  expect(view.status).toContain('Please log in');
});

test('payment controller notes notification failure after success', () => {
  const view = createViewStub();
  const paymentService = {
    submitCardPayment: () => ({ ok: true, receipt: { reference: 'ref_1' }, notification: { ok: false } }),
  };
  const sessionState = { isAuthenticated: () => true, getCurrentUser: () => ({}) };
  const controller = createPaymentController({ view, paymentService, sessionState });
  controller.show({ registrationId: 'reg_1', amount: 100 });
  controller.submit({ preventDefault: () => {} });
  expect(view.status).toContain('confirmation delivery failed');
});

test('payment controller notes success without notification errors', () => {
  const view = createViewStub();
  const paymentService = {
    submitCardPayment: () => ({ ok: true, receipt: { reference: 'ref_1' }, notification: { ok: true } }),
  };
  const sessionState = { isAuthenticated: () => true, getCurrentUser: () => ({}) };
  const controller = createPaymentController({ view, paymentService, sessionState });
  controller.show({ registrationId: 'reg_1', amount: 100 });
  controller.submit({ preventDefault: () => {} });
  expect(view.status).toContain('Payment confirmed');
});

test('payment controller falls back to status view when receipt render fails', () => {
  const view = createViewStub();
  view.setReceipt = () => { throw new Error('render_failed'); };
  const statusView = { setPaymentStatus: jest.fn(), setStatus: jest.fn() };
  const paymentService = {
    submitCardPayment: () => ({
      ok: true,
      receipt: {
        registrationId: 'reg_1',
        amount: 100,
        paidAt: '2026-02-01T12:00:00.000Z',
        reference: 'ref_fail',
      },
    }),
  };
  const sessionState = { isAuthenticated: () => true, getCurrentUser: () => ({}) };
  const controller = createPaymentController({ view, statusView, paymentService, sessionState });
  controller.show({ registrationId: 'reg_1', amount: 100 });
  controller.submit({ preventDefault: () => {} });
  expect(statusView.setPaymentStatus).toHaveBeenCalled();
  expect(controller.view).toBe(statusView);
});

test('payment controller falls back with empty receipt data when missing', () => {
  const view = createViewStub();
  view.setReceipt = () => { throw new Error('render_failed'); };
  const statusView = { setPaymentStatus: jest.fn(), setStatus: jest.fn() };
  const paymentService = {
    submitCardPayment: () => ({ ok: true, receipt: null }),
  };
  const sessionState = { isAuthenticated: () => true, getCurrentUser: () => ({}) };
  const controller = createPaymentController({ view, statusView, paymentService, sessionState });
  controller.show({ registrationId: 'reg_1', amount: 100 });
  controller.submit({ preventDefault: () => {} });
  expect(statusView.setPaymentStatus).toHaveBeenCalledWith({
    registrationId: '',
    status: 'paid',
    amount: '',
    paidAt: '',
    reference: '',
  });
});

test('payment controller keeps form view when receipt renders successfully with status view', () => {
  const view = createViewStub();
  const statusView = { setPaymentStatus: jest.fn(), setStatus: jest.fn() };
  const paymentService = {
    submitCardPayment: () => ({ ok: true, receipt: { registrationId: 'reg_1', amount: 100, reference: 'ref_1' } }),
  };
  const sessionState = { isAuthenticated: () => true, getCurrentUser: () => ({}) };
  const controller = createPaymentController({ view, statusView, paymentService, sessionState });
  controller.show({ registrationId: 'reg_1', amount: 100 });
  controller.submit({ preventDefault: () => {} });
  expect(controller.view).toBe(view);
});

test('payment controller renders empty receipt when no status view', () => {
  const view = createViewStub();
  let receiptArg = null;
  view.setReceipt = (value) => {
    receiptArg = value;
  };
  const paymentService = {
    submitCardPayment: () => ({ ok: true, receipt: null, notification: { ok: true } }),
  };
  const sessionState = { isAuthenticated: () => true, getCurrentUser: () => ({}) };
  const controller = createPaymentController({ view, paymentService, sessionState });
  controller.show({ registrationId: 'reg_1', amount: 100 });
  controller.submit({ preventDefault: () => {} });
  expect(receiptArg).toEqual({});
});

test('payment controller renders empty receipt when status view present and receipt missing', () => {
  const view = createViewStub();
  let receiptArg = null;
  view.setReceipt = (value) => {
    receiptArg = value;
  };
  const statusView = { setPaymentStatus: jest.fn(), setStatus: jest.fn() };
  const paymentService = {
    submitCardPayment: () => ({ ok: true, receipt: null, notification: { ok: true } }),
  };
  const sessionState = { isAuthenticated: () => true, getCurrentUser: () => ({}) };
  const controller = createPaymentController({ view, statusView, paymentService, sessionState });
  controller.show({ registrationId: 'reg_1', amount: 100 });
  controller.submit({ preventDefault: () => {} });
  expect(receiptArg).toEqual({});
  expect(controller.view).toBe(view);
});

test('payment controller cancel updates status', () => {
  const view = createViewStub();
  const controller = createPaymentController({ view });
  controller.cancel();
  expect(view.status).toContain('Payment cancelled');
});

test('payment controller completeAuthentication returns early when no pending payment', () => {
  const view = createViewStub();
  const controller = createPaymentController({ view });
  const resultView = controller.completeAuthentication();
  expect(resultView).toBe(view);
});

test('payment controller completeAuthentication handles failed auth', () => {
  const view = createViewStub();
  const paymentService = {
    completeAuthentication: () => ({ ok: false, reason: 'auth_failed' }),
    submitCardPayment: () => ({ ok: false, reason: 'auth_required', payment: { id: 'pay_1' } }),
  };
  const sessionState = { isAuthenticated: () => true, getCurrentUser: () => ({}) };
  const controller = createPaymentController({ view, paymentService, sessionState });
  controller.show({ registrationId: 'reg_1', amount: 100 });
  controller.submit();
  controller.completeAuthentication(false);
  expect(view.status).toContain('Payment could not be processed');
});

test('payment controller completeAuthentication renders empty receipt on success', () => {
  const view = createViewStub();
  let receiptArg = null;
  view.setReceipt = (value) => {
    receiptArg = value;
  };
  const paymentService = {
    completeAuthentication: () => ({ ok: true, receipt: null }),
    submitCardPayment: () => ({ ok: false, reason: 'auth_required', payment: { id: 'pay_1' } }),
  };
  const sessionState = { isAuthenticated: () => true, getCurrentUser: () => ({}) };
  const controller = createPaymentController({ view, paymentService, sessionState });
  controller.show({ registrationId: 'reg_1', amount: 100 });
  controller.submit();
  controller.completeAuthentication(true);
  expect(receiptArg).toEqual({});
});

test('payment controller show preserves existing context when values missing', () => {
  const view = createViewStub();
  const controller = createPaymentController({ view });
  controller.show({ registrationId: 'reg_1', amount: 100, currency: 'USD', idempotencyKey: 'idem_1' });
  const returned = controller.show({ amount: NaN });
  expect(returned).toBe(view);
});

test('payment controller show uses default context when no args provided', () => {
  const view = createViewStub();
  const controller = createPaymentController({ view });
  const result = controller.show();
  expect(result).toBe(view);
});

test('payment controller can be created with default args', () => {
  const controller = createPaymentController();
  expect(controller.view).toBe(undefined);
});
