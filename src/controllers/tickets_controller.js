import { authService as defaultAuthService } from '../services/auth_service.js';
import { confirmationGeneratorService as defaultConfirmationGeneratorService } from '../services/confirmation_generator_service.js';
import { registrationService as defaultRegistrationService } from '../services/registration_service.js';

const ACCESS_MESSAGE = 'Please log in to view tickets.';
const NOT_FOUND_MESSAGE = 'No tickets available.';
const PENDING_MESSAGE = 'Payment is recorded. Confirmation will be available on the next visit.';
const STORAGE_MESSAGE = 'Confirmation could not be saved. Please try again later.';
const PAYMENT_INCOMPLETE = 'Payment is not completed yet.';

export function createTicketsController({
  view,
  sessionState,
  authService = defaultAuthService,
  confirmationGeneratorService = defaultConfirmationGeneratorService,
  registrationService = defaultRegistrationService,
  onAuthRequired = null,
} = {}) {
  function requireAuth() {
    return authService.requireAuth({ sessionState, onAuthRequired });
  }

  function show() {
    const auth = requireAuth();
    if (!auth.ok) {
      view.setStatus(ACCESS_MESSAGE, true);
      view.setTickets([]);
      return view;
    }
    const userId = auth.user && (auth.user.id || auth.user.userId || auth.user.email);
    const registration = registrationService.getRegistrationForUser
      ? registrationService.getRegistrationForUser(userId)
      : null;
    if (!registration) {
      view.setTickets([]);
      view.setStatus(NOT_FOUND_MESSAGE, true);
      return view;
    }
    const result = confirmationGeneratorService.generateConfirmation({
      registrationId: registration.id,
    });
    if (!result.ok) {
      view.setTickets([]);
      if (result.reason === 'pending') {
        view.setStatus(PENDING_MESSAGE, true);
        return view;
      }
      if (result.reason === 'storage_failed') {
        view.setStatus(STORAGE_MESSAGE, true);
        return view;
      }
      if (result.reason === 'payment_incomplete') {
        view.setStatus(PAYMENT_INCOMPLETE, true);
        return view;
      }
      view.setStatus(NOT_FOUND_MESSAGE, true);
      return view;
    }
    view.setTickets([result.receipt]);
    view.setStatus('', false);
    return view;
  }

  return {
    view,
    show,
  };
}
