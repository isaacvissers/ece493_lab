import { reviewFormAccess as defaultReviewFormAccess } from '../services/review-form-access.js';
import { errorLog as defaultErrorLog } from '../services/error-log.js';
import { authController as defaultAuthController } from './auth-controller.js';

const AUTH_MESSAGE = 'Please log in to access the review form.';
const NOT_ASSIGNED_MESSAGE = 'You are not authorized to access this review form.';
const NOT_ACCEPTED_MESSAGE = 'Assignment must be accepted before opening the review form.';
const FORM_MISSING_MESSAGE = 'Review form is unavailable. Please contact support.';
const LOAD_FAILURE_MESSAGE = 'Review form could not be loaded. Please retry.';
const CLOSED_MESSAGE = 'Review period is closed. View-only access.';

export function createReviewFormController({
  view,
  sessionState,
  paperId,
  reviewFormAccess = defaultReviewFormAccess,
  errorLog = defaultErrorLog,
  authController = defaultAuthController,
} = {}) {
  function getReviewerEmail() {
    const user = sessionState.getCurrentUser();
    return user && user.email ? user.email : null;
  }

  function requireAuth() {
    if (!sessionState.isAuthenticated()) {
      view.setStatus(AUTH_MESSAGE, true);
      if (authController) {
        authController.requestLogin({ destination: 'review-form', payload: { paperId } });
      }
      return false;
    }
    return true;
  }

  function loadForm() {
    view.setStatus('', false);
    if (!requireAuth()) {
      return;
    }

    const reviewerEmail = getReviewerEmail();
    const result = reviewFormAccess.getForm({
      paperId,
      reviewerEmail,
      errorLog,
    });

    if (!result.ok) {
      if (result.reason === 'not_assigned') {
        view.setStatus(NOT_ASSIGNED_MESSAGE, true);
        return;
      }
      if (result.reason === 'not_accepted') {
        view.setStatus(NOT_ACCEPTED_MESSAGE, true);
        return;
      }
      if (result.reason === 'form_missing') {
        view.setStatus(FORM_MISSING_MESSAGE, true);
        return;
      }
      view.setStatus(LOAD_FAILURE_MESSAGE, true);
      return;
    }

    view.setForm(result.form);
    if (result.draft) {
      view.setDraft(result.draft);
    }
    if (result.viewOnly) {
      view.setViewOnly(true, CLOSED_MESSAGE);
    } else {
      view.setViewOnly(false, '');
    }
    view.setStatus('Review form loaded.', false);
  }

  return {
    init() {
      loadForm();
    },
  };
}
