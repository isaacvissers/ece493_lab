import { paymentStatusService as defaultPaymentStatusService } from '../services/payment_status_service.js';
import { sessionState as defaultSessionState } from '../models/session-state.js';

const ACCESS_MESSAGE = 'Please log in to view payment status.';
const NOT_FOUND_MESSAGE = 'Payment status not available.';

export function createPaymentStatusController({
  view,
  paymentStatusService = defaultPaymentStatusService,
  sessionState = defaultSessionState,
  onAuthRequired = null,
} = {}) {
  function requireAuth() {
    if (sessionState && sessionState.isAuthenticated && sessionState.isAuthenticated()) {
      return { ok: true };
    }
    if (typeof onAuthRequired === 'function') {
      onAuthRequired(ACCESS_MESSAGE);
    }
    return { ok: false };
  }

  function show({ paymentId = null, registrationId = null } = {}) {
    const auth = requireAuth();
    if (!auth.ok) {
      view.setStatus(ACCESS_MESSAGE, true);
      return view;
    }

    let result;
    if (paymentId) {
      result = paymentStatusService.getPaymentStatus({ paymentId });
    } else {
      result = paymentStatusService.getRegistrationStatus({ registrationId });
    }

    if (!result.ok) {
      view.setStatus(NOT_FOUND_MESSAGE, true);
      view.setPaymentStatus({});
      return view;
    }

    const receipt = result.receipt || {};
    const payment = result.payment || {};
    const balance = result.balance || {};
    const status = balance.status || payment.status || '';

    view.setPaymentStatus({
      registrationId: payment.registrationId || balance.registrationId || '',
      status,
      amount: receipt.amount ? `${receipt.amount}` : payment.amount ? `${payment.amount}` : '',
      paidAt: receipt.paidAt || payment.capturedAt || '',
      reference: receipt.reference || payment.reference || '',
    });
    view.setStatus('', false);
    return view;
  }

  return {
    view,
    show,
  };
}
