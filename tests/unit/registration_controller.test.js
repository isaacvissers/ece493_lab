import { jest } from '@jest/globals';
import { createRegistrationController } from '../../src/controllers/registration_controller.js';
import { createRegistrationView } from '../../src/views/registration_view.js';
import { createRegistrationStatusView } from '../../src/views/registration_status_view.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

test('shows access denied when unauthenticated', () => {
  const view = createRegistrationView();
  const statusView = createRegistrationStatusView();
  const controller = createRegistrationController({
    view,
    statusView,
    authService: { requireAuth: () => ({ ok: false }) },
  });
  const event = { preventDefault: jest.fn() };
  controller.submit(event);
  expect(view.element.textContent).toContain('Sign in');
});

test('creates controller with default parameters', () => {
  const controller = createRegistrationController();
  expect(typeof controller.submit).toBe('function');
});

test('retry payment reports missing registration', () => {
  const view = createRegistrationView();
  const statusView = createRegistrationStatusView();
  const controller = createRegistrationController({
    view,
    statusView,
    authService: { requireAuth: () => ({ ok: true, user: { id: 'user_x' } }) },
    registrationService: { retryPayment: () => ({ ok: false, reason: 'not_found' }) },
  });
  controller.retryPayment();
  expect(view.element.textContent).toContain('Registration not found');
});

test('retry payment shows access denied when unauthenticated', () => {
  const view = createRegistrationView();
  const statusView = createRegistrationStatusView();
  const controller = createRegistrationController({
    view,
    statusView,
    authService: { requireAuth: () => ({ ok: false }) },
    registrationService: { retryPayment: jest.fn() },
  });
  controller.retryPayment();
  expect(view.element.textContent).toContain('Sign in');
});

test('retry payment handles payment failures', () => {
  const view = createRegistrationView();
  const statusView = createRegistrationStatusView();
  const controller = createRegistrationController({
    view,
    statusView,
    authService: { requireAuth: () => ({ ok: true, user: { id: 'user_pay' } }) },
    registrationService: {
      retryPayment: () => ({
        ok: false,
        reason: 'payment_failed',
        receipt: {
          name: 'Ada',
          affiliation: 'Lab',
          attendanceType: 'virtual',
          registrationStatus: 'PendingPayment',
          paymentStatus: 'failed',
        },
      }),
    },
  });
  controller.retryPayment();
  expect(view.element.textContent).toContain('Payment failed');
});

test('show renders pending registration status', () => {
  const view = createRegistrationView();
  const statusView = createRegistrationStatusView();
  const controller = createRegistrationController({
    view,
    statusView,
    authService: { requireAuth: () => ({ ok: true, user: { id: 'user_show' } }) },
    registrationService: {
      getRegistrationStatus: () => ({
        ok: true,
        registration: { status: 'PendingPayment' },
        receipt: {
          name: 'Ada',
          affiliation: 'Lab',
          attendanceType: 'virtual',
          registrationStatus: 'PendingPayment',
          paymentStatus: 'failed',
        },
      }),
    },
    registrationWindowService: { getWindow: () => ({ isOpen: true }) },
    paymentService: { getRegistrationFee: () => 0 },
  });
  controller.show();
  const retryButton = view.element.querySelector('#registration-retry-payment');
  expect(retryButton.hidden).toBe(false);
});

test('show reports access denied when unauthenticated', () => {
  const view = createRegistrationView();
  const statusView = createRegistrationStatusView();
  const controller = createRegistrationController({
    view,
    statusView,
    authService: { requireAuth: () => ({ ok: false }) },
    registrationWindowService: { getWindow: () => ({ isOpen: true }) },
    paymentService: { getRegistrationFee: () => 0 },
  });
  controller.show();
  expect(view.element.textContent).toContain('Sign in');
});

test('show ignores missing registration status', () => {
  const view = createRegistrationView();
  const statusView = createRegistrationStatusView();
  const controller = createRegistrationController({
    view,
    statusView,
    authService: { requireAuth: () => ({ ok: true, user: { id: 'user_none' } }) },
    registrationService: { getRegistrationStatus: () => ({ ok: false }) },
    registrationWindowService: { getWindow: () => ({ isOpen: true }) },
    paymentService: { getRegistrationFee: () => 0 },
  });
  controller.show();
  expect(view.element.querySelector('#registration-receipt-slot').hidden).toBe(true);
});

test('submit renders receipt even when receipt missing', () => {
  const view = createRegistrationView();
  const statusView = createRegistrationStatusView();
  const controller = createRegistrationController({
    view,
    statusView,
    authService: { requireAuth: () => ({ ok: true, user: { id: 'user_receipt' } }) },
    registrationService: { submitRegistration: () => ({ ok: true }) },
  });
  const event = { preventDefault: jest.fn() };
  controller.submit(event);
  expect(view.element.querySelector('#registration-receipt-name').textContent).toBe('');
});

test('submit renders receipt when receipt is null', () => {
  const view = createRegistrationView();
  const statusView = createRegistrationStatusView();
  const controller = createRegistrationController({
    view,
    statusView,
    authService: { requireAuth: () => ({ ok: true, user: { id: 'user_receipt' } }) },
    registrationService: { submitRegistration: () => ({ ok: true, receipt: null }) },
  });
  const event = { preventDefault: jest.fn() };
  controller.submit(event);
  expect(view.element.querySelector('#registration-receipt-name').textContent).toBe('');
});

test('submit renders receipt when provided', () => {
  const view = createRegistrationView();
  const statusView = createRegistrationStatusView();
  const controller = createRegistrationController({
    view,
    statusView,
    authService: { requireAuth: () => ({ ok: true, user: { id: 'user_receipt' } }) },
    registrationService: {
      submitRegistration: () => ({
        ok: true,
        receipt: {
          name: 'Ada',
          affiliation: 'Lab',
          attendanceType: 'virtual',
          registrationStatus: 'Registered',
          paymentStatus: 'succeeded',
        },
      }),
    },
  });
  const event = { preventDefault: jest.fn() };
  controller.submit(event);
  expect(view.element.querySelector('#registration-receipt-name').textContent).toContain('Ada');
});

test('submit handles closed registration without window data', () => {
  const view = createRegistrationView();
  const statusView = createRegistrationStatusView();
  const controller = createRegistrationController({
    view,
    statusView,
    authService: { requireAuth: () => ({ ok: true, user: { id: 'user_closed' } }) },
    registrationService: { submitRegistration: () => ({ ok: false, reason: 'closed', window: null }) },
  });
  const event = { preventDefault: jest.fn() };
  controller.submit(event);
  expect(view.element.textContent).toContain('Registration closed');
});

test('submit uses userId fallback values', () => {
  const view = createRegistrationView();
  const statusView = createRegistrationStatusView();
  const submitRegistration = jest.fn(() => ({ ok: false, reason: 'save_failed' }));
  const controller = createRegistrationController({
    view,
    statusView,
    authService: { requireAuth: () => ({ ok: true, user: { userId: 'user_alt' } }) },
    registrationService: { submitRegistration },
  });
  const event = { preventDefault: jest.fn() };
  controller.submit(event);
  expect(submitRegistration).toHaveBeenCalledWith(expect.objectContaining({ userId: 'user_alt' }));
});

test('submit handles required validation errors', () => {
  const view = createRegistrationView();
  const statusView = createRegistrationStatusView();
  const controller = createRegistrationController({
    view,
    statusView,
    authService: { requireAuth: () => ({ ok: true, user: { id: 'user_required' } }) },
    registrationService: {
      submitRegistration: () => ({
        ok: false,
        reason: 'validation',
        errors: { name: 'required' },
      }),
    },
  });
  const event = { preventDefault: jest.fn() };
  controller.submit(event);
  expect(view.element.querySelector('#registration-name-error').textContent).toContain('required');
});

test('submit passes undefined userId when user missing', () => {
  const view = createRegistrationView();
  const statusView = createRegistrationStatusView();
  const submitRegistration = jest.fn(() => ({ ok: false, reason: 'save_failed' }));
  const controller = createRegistrationController({
    view,
    statusView,
    authService: { requireAuth: () => ({ ok: true, user: null }) },
    registrationService: { submitRegistration },
  });
  const event = { preventDefault: jest.fn() };
  controller.submit(event);
  expect(submitRegistration).toHaveBeenCalledWith(expect.objectContaining({ userId: null }));
});

test('submit passes falsy userId when user fields empty', () => {
  const view = createRegistrationView();
  const statusView = createRegistrationStatusView();
  const submitRegistration = jest.fn(() => ({ ok: false, reason: 'save_failed' }));
  const controller = createRegistrationController({
    view,
    statusView,
    authService: { requireAuth: () => ({ ok: true, user: { id: '', userId: '', email: '' } }) },
    registrationService: { submitRegistration },
  });
  const event = { preventDefault: jest.fn() };
  controller.submit(event);
  expect(submitRegistration).toHaveBeenCalledWith(expect.objectContaining({ userId: '' }));
});

test('submit uses email fallback for userId', () => {
  const view = createRegistrationView();
  const statusView = createRegistrationStatusView();
  const submitRegistration = jest.fn(() => ({ ok: false, reason: 'save_failed' }));
  const controller = createRegistrationController({
    view,
    statusView,
    authService: { requireAuth: () => ({ ok: true, user: { email: 'user@example.com' } }) },
    registrationService: { submitRegistration },
  });
  const event = { preventDefault: jest.fn() };
  controller.submit(event);
  expect(submitRegistration).toHaveBeenCalledWith(expect.objectContaining({ userId: 'user@example.com' }));
});

test('submit handles invalid validation errors', () => {
  const view = createRegistrationView();
  const statusView = createRegistrationStatusView();
  const controller = createRegistrationController({
    view,
    statusView,
    authService: { requireAuth: () => ({ ok: true, user: { id: 'user_invalid' } }) },
    registrationService: {
      submitRegistration: () => ({
        ok: false,
        reason: 'validation',
        errors: { contactEmail: 'invalid' },
      }),
    },
  });
  const event = { preventDefault: jest.fn() };
  controller.submit(event);
  expect(view.element.querySelector('#registration-email-error').textContent).toContain('valid value');
});

test('submit handles validation without error details', () => {
  const view = createRegistrationView();
  const statusView = createRegistrationStatusView();
  const controller = createRegistrationController({
    view,
    statusView,
    authService: { requireAuth: () => ({ ok: true, user: { id: 'user_no_errors' } }) },
    registrationService: {
      submitRegistration: () => ({
        ok: false,
        reason: 'validation',
      }),
    },
  });
  const event = { preventDefault: jest.fn() };
  controller.submit(event);
  expect(view.element.textContent).toContain('Fix highlighted registration fields');
});

test('submit handles mixed validation errors', () => {
  const view = createRegistrationView();
  const statusView = createRegistrationStatusView();
  const controller = createRegistrationController({
    view,
    statusView,
    authService: { requireAuth: () => ({ ok: true, user: { id: 'user_mix' } }) },
    registrationService: {
      submitRegistration: () => ({
        ok: false,
        reason: 'validation',
        errors: { name: 'required', contactEmail: 'invalid' },
      }),
    },
  });
  const event = { preventDefault: jest.fn() };
  controller.submit(event);
  expect(view.element.querySelector('#registration-name-error').textContent).toContain('required');
  expect(view.element.querySelector('#registration-email-error').textContent).toContain('valid value');
});

test('retry payment uses email fallback', () => {
  const view = createRegistrationView();
  const statusView = createRegistrationStatusView();
  const retryPayment = jest.fn(() => ({ ok: false, reason: 'not_found' }));
  const controller = createRegistrationController({
    view,
    statusView,
    authService: { requireAuth: () => ({ ok: true, user: { email: 'user@example.com' } }) },
    registrationService: { retryPayment },
  });
  controller.retryPayment();
  expect(retryPayment).toHaveBeenCalledWith(expect.objectContaining({ userId: 'user@example.com' }));
});

test('show uses email fallback for status lookup', () => {
  const view = createRegistrationView();
  const statusView = createRegistrationStatusView();
  const getRegistrationStatus = jest.fn(() => ({ ok: false }));
  const controller = createRegistrationController({
    view,
    statusView,
    authService: { requireAuth: () => ({ ok: true, user: { email: 'user@example.com' } }) },
    registrationService: { getRegistrationStatus },
    registrationWindowService: { getWindow: () => ({ isOpen: true }) },
    paymentService: { getRegistrationFee: () => 0 },
  });
  controller.show();
  expect(getRegistrationStatus).toHaveBeenCalledWith(expect.objectContaining({ userId: 'user@example.com' }));
});
