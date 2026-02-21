import { paymentService as defaultPaymentService } from '../services/payment_service.js';
import { paymentStatusService as defaultPaymentStatusService } from '../services/payment_status_service.js';
import { sessionState as defaultSessionState } from '../models/session-state.js';

const ACCESS_MESSAGE = 'Please log in to submit payment.';
const SUCCESS_MESSAGE = 'Payment confirmed.';
const GENERIC_FAILURE = 'Payment could not be processed. Please try again.';
const AUTH_REQUIRED = 'Additional authentication required to complete payment.';
const CANCELLED_MESSAGE = 'Payment cancelled.';

function generateIdempotencyKey() {
  return `idem_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export function createPaymentController({
  view,
  statusView = null,
  errorView = null,
  sessionState = defaultSessionState,
  paymentService = defaultPaymentService,
  paymentStatusService = defaultPaymentStatusService,
  onAuthRequired = null,
} = {}) {
  let currentView = view;
  let context = { registrationId: null, amount: 0, currency: 'USD' };
  let pendingPaymentId = null;

  function setActiveView(next) {
    currentView = next;
  }

  function requireAuth() {
    if (sessionState && sessionState.isAuthenticated && sessionState.isAuthenticated()) {
      return { ok: true, user: sessionState.getCurrentUser() };
    }
    if (typeof onAuthRequired === 'function') {
      onAuthRequired(ACCESS_MESSAGE);
    }
    return { ok: false };
  }

  function renderReceipt(receipt) {
    if (!statusView) {
      view.setReceipt(receipt || {});
      view.setStatus(SUCCESS_MESSAGE, false);
      return;
    }
    try {
      view.setReceipt(receipt || {});
      view.setStatus(SUCCESS_MESSAGE, false);
    } catch (error) {
      statusView.setPaymentStatus({
        registrationId: receipt && receipt.registrationId ? receipt.registrationId : '',
        status: 'paid',
        amount: receipt && receipt.amount ? receipt.amount : '',
        paidAt: receipt && receipt.paidAt ? receipt.paidAt : '',
        reference: receipt && receipt.reference ? receipt.reference : '',
      });
      statusView.setStatus('Receipt available in payment status.', false);
      setActiveView(statusView);
    }
  }

  function handleFailure(message) {
    if (errorView) {
      errorView.setMessage(message || GENERIC_FAILURE);
      setActiveView(errorView);
    } else {
      view.setStatus(message || GENERIC_FAILURE, true);
    }
  }

  function submit(event) {
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    view.clearErrors();
    view.setStatus('', false);
    setActiveView(view);

    const auth = requireAuth();
    if (!auth.ok) {
      view.setStatus(ACCESS_MESSAGE, true);
      return currentView;
    }

    const values = view.getValues();
    const result = paymentService.submitCardPayment({
      registrationId: context.registrationId,
      amount: context.amount,
      currency: context.currency,
      idempotencyKey: context.idempotencyKey || generateIdempotencyKey(),
      cardholderName: values.cardholderName,
      cardNumber: values.cardNumber,
      expiryMonth: values.expiryMonth,
      expiryYear: values.expiryYear,
      cvv: values.cvv,
      billingPostal: values.billingPostal,
    });

    if (!result.ok) {
      if (result.reason === 'validation') {
        Object.entries(result.errors || {}).forEach(([field, code]) => {
          const message = code === 'required' ? 'This field is required.' : 'Enter a valid value.';
          view.setFieldError(field, message);
        });
        view.setStatus('Fix highlighted payment fields.', true);
        return currentView;
      }
      if (result.reason === 'auth_required') {
        pendingPaymentId = result.payment && result.payment.id ? result.payment.id : null;
        view.setStatus(AUTH_REQUIRED, true);
        return currentView;
      }
      if (result.reason === 'persistence_failure') {
        handleFailure('Payment approved but confirmation could not be saved. Check payment status.');
        return currentView;
      }
      handleFailure();
      return currentView;
    }

    renderReceipt(result.receipt);
    if (result.notification && !result.notification.ok) {
      view.setStatus('Payment confirmed, but confirmation delivery failed.', true);
    }

    return currentView;
  }

  function cancel() {
    view.setStatus(CANCELLED_MESSAGE, false);
    return currentView;
  }

  function completeAuthentication(success = true) {
    if (!pendingPaymentId) {
      return currentView;
    }
    const result = paymentService.completeAuthentication({ paymentId: pendingPaymentId, success });
    if (!result.ok) {
      handleFailure();
      return currentView;
    }
    pendingPaymentId = null;
    renderReceipt(result.receipt);
    return currentView;
  }

  function show(nextContext = {}) {
    context = {
      registrationId: nextContext.registrationId || context.registrationId,
      amount: Number.isFinite(nextContext.amount) ? nextContext.amount : context.amount,
      currency: nextContext.currency || context.currency,
      idempotencyKey: nextContext.idempotencyKey || context.idempotencyKey,
    };
    return currentView;
  }

  return {
    get view() {
      return currentView;
    },
    init() {
      view.onSubmit(submit);
      view.onCancel(cancel);
    },
    show,
    submit,
    cancel,
    completeAuthentication,
  };
}
