import { authService as defaultAuthService } from '../services/auth_service.js';
import { registrationService as defaultRegistrationService } from '../services/registration_service.js';
import { registrationWindowService as defaultRegistrationWindowService } from '../services/registration_window_service.js';
import { paymentService as defaultPaymentService } from '../services/payment_service.js';
import { notificationService as defaultNotificationService } from '../services/notification_service.js';
import { registrationLogService as defaultRegistrationLogService } from '../services/registration_log_service.js';
import { createRegistrationStatusView } from '../views/registration_status_view.js';

const ACCESS_DENIED_MESSAGE = 'Sign in to register for the conference.';
const CLOSED_MESSAGE = 'Registration closed.';
const DUPLICATE_MESSAGE = 'You are already registered.';
const PAYMENT_FAILED_MESSAGE = 'Payment failed. Please retry.';
const SAVE_FAILED_MESSAGE = 'Registration could not be saved. Try again.';
const SUCCESS_MESSAGE = 'Registration complete.';
const NOTIFICATION_FAILED_MESSAGE = 'Registration complete, but confirmation failed.';

export function createRegistrationController({
  view,
  statusView = createRegistrationStatusView(),
  sessionState,
  authService = defaultAuthService,
  registrationService = defaultRegistrationService,
  registrationWindowService = defaultRegistrationWindowService,
  paymentService = defaultPaymentService,
  notificationService = defaultNotificationService,
  registrationLogService = defaultRegistrationLogService,
  onAuthRequired = null,
} = {}) {
  function requireAuth() {
    return authService.requireAuth({ sessionState, onAuthRequired });
  }

  function renderReceipt(result, message = '', isError = false) {
    view.setReceiptView(statusView);
    statusView.setReceipt(result.receipt || {});
    statusView.setStatus(message, isError);
  }

  function refreshWindow() {
    const window = registrationWindowService.getWindow();
    view.setWindow(window);
    view.setFee(paymentService.getRegistrationFee());
    if (!window.isOpen) {
      view.setClosed(window);
    } else {
      view.setFormEnabled(true);
    }
  }

  function handleDuplicate(result) {
    renderReceipt(result, DUPLICATE_MESSAGE, true);
    statusView.setRetryVisible(false);
  }

  function handlePaymentFailure(result) {
    renderReceipt(result, PAYMENT_FAILED_MESSAGE, true);
    statusView.setRetryVisible(true);
  }

  function handleSaveFailure() {
    view.setStatus(SAVE_FAILED_MESSAGE, true);
  }

  function handleSuccess(result) {
    renderReceipt(result, SUCCESS_MESSAGE, false);
    statusView.setRetryVisible(false);
    if (result.notification && !result.notification.ok) {
      statusView.setStatus(NOTIFICATION_FAILED_MESSAGE, true);
    }
  }

  function submit(event) {
    event.preventDefault();
    view.clearErrors();
    view.setReceiptView(null);

    const auth = requireAuth();
    if (!auth.ok) {
      view.setStatus(ACCESS_DENIED_MESSAGE, true);
      return;
    }

    const result = registrationService.submitRegistration({
      userId: auth.user && (auth.user.id || auth.user.userId || auth.user.email),
      values: view.getValues(),
      paymentService,
      registrationWindowService,
      notificationService,
      registrationLogService,
    });

    if (!result.ok) {
      if (result.reason === 'closed') {
        view.setClosed(result.window || {});
        view.setStatus(CLOSED_MESSAGE, true);
        return;
      }
      if (result.reason === 'validation') {
        Object.entries(result.errors || {}).forEach(([field, code]) => {
          const message = code === 'required' ? 'This field is required.' : 'Enter a valid value.';
          view.setFieldError(field, message);
        });
        view.setStatus('Fix highlighted registration fields.', true);
        return;
      }
      if (result.reason === 'duplicate') {
        handleDuplicate(result);
        return;
      }
      if (result.reason === 'payment_failed') {
        handlePaymentFailure(result);
        return;
      }
      handleSaveFailure();
      return;
    }

    handleSuccess(result);
  }

  function retryPayment() {
    const auth = requireAuth();
    if (!auth.ok) {
      view.setStatus(ACCESS_DENIED_MESSAGE, true);
      return;
    }
    const result = registrationService.retryPayment({
      userId: auth.user && (auth.user.id || auth.user.userId || auth.user.email),
      paymentService,
      notificationService,
      registrationLogService,
    });
    if (!result.ok) {
      if (result.reason === 'payment_failed') {
        handlePaymentFailure(result);
        return;
      }
      view.setStatus('Registration not found.', true);
      return;
    }
    handleSuccess(result);
  }

  return {
    view,
    statusView,
    init() {
      refreshWindow();
      view.onSubmit(submit);
      statusView.onRetryPayment(retryPayment);
    },
    show() {
      refreshWindow();
      const auth = requireAuth();
      if (!auth.ok) {
        view.setStatus(ACCESS_DENIED_MESSAGE, true);
        return;
      }
      const status = registrationService.getRegistrationStatus({
        userId: auth.user && (auth.user.id || auth.user.userId || auth.user.email),
        paymentService,
      });
      if (status.ok) {
        renderReceipt(status);
        statusView.setRetryVisible(status.registration && status.registration.status === 'PendingPayment');
      }
    },
    submit,
    retryPayment,
  };
}
