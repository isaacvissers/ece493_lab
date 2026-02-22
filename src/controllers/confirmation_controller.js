import { authService as defaultAuthService } from '../services/auth_service.js';
import { confirmationGeneratorService as defaultConfirmationGeneratorService } from '../services/confirmation_generator_service.js';
import { registrationService as defaultRegistrationService } from '../services/registration_service.js';

const ACCESS_MESSAGE = 'Please log in to view confirmation.';
const NOT_FOUND_MESSAGE = 'Confirmation not available.';
const PENDING_MESSAGE = 'Payment is recorded. Confirmation will be available on the next visit.';
const STORAGE_MESSAGE = 'Confirmation could not be saved. Please try again later.';
const PAYMENT_INCOMPLETE = 'Payment is not completed yet.';
const DELIVERY_FAILED = 'Confirmation ready, but delivery failed.';
const READY_MESSAGE = 'Confirmation ready.';

export function createConfirmationController({
  view,
  errorView = null,
  sessionState,
  authService = defaultAuthService,
  confirmationGeneratorService = defaultConfirmationGeneratorService,
  registrationService = defaultRegistrationService,
  onAuthRequired = null,
} = {}) {
  let currentView = view;

  function setActiveView(next) {
    currentView = next;
  }

  function requireAuth() {
    return authService.requireAuth({ sessionState, onAuthRequired });
  }

  function resolveRegistration({ registrationId, userId }) {
    if (registrationId) {
      return registrationService.getRegistrationById
        ? registrationService.getRegistrationById(registrationId)
        : null;
    }
    if (!userId) {
      return null;
    }
    return registrationService.getRegistrationForUser
      ? registrationService.getRegistrationForUser(userId)
      : null;
  }

  function handleFailure(reason) {
    if (reason === 'pending') {
      if (errorView) {
        errorView.setMessage(PENDING_MESSAGE);
        setActiveView(errorView);
      } else {
        view.setStatus(PENDING_MESSAGE, true);
      }
      return;
    }
    if (reason === 'storage_failed') {
      if (errorView) {
        errorView.setMessage(STORAGE_MESSAGE);
        setActiveView(errorView);
      } else {
        view.setStatus(STORAGE_MESSAGE, true);
      }
      return;
    }
    if (reason === 'payment_incomplete') {
      view.setStatus(PAYMENT_INCOMPLETE, true);
      return;
    }
    view.setStatus(NOT_FOUND_MESSAGE, true);
  }

  function show({ registrationId = null } = {}) {
    setActiveView(view);
    const auth = requireAuth();
    if (!auth.ok) {
      view.setStatus(ACCESS_MESSAGE, true);
      return currentView;
    }
    const userId = auth.user && (auth.user.id || auth.user.userId || auth.user.email);
    const registration = resolveRegistration({ registrationId, userId });
    if (!registration || (registration.userId && userId && registration.userId !== userId)) {
      view.setStatus(NOT_FOUND_MESSAGE, true);
      return currentView;
    }

    const result = confirmationGeneratorService.generateConfirmation({
      registrationId: registration.id,
    });
    if (!result.ok) {
      handleFailure(result.reason);
      return currentView;
    }

    view.setConfirmation(result.receipt || {});
    view.setStatus(READY_MESSAGE, false);
    if (result.notification && !result.notification.ok) {
      view.setStatus(DELIVERY_FAILED, true);
    }
    return currentView;
  }

  return {
    view,
    errorView,
    show,
  };
}
