import { reviewSubmissionService as defaultReviewSubmissionService } from '../services/review-submission-service.js';
import { reviewValidationService as defaultReviewValidationService } from '../services/review-validation-service.js';
import { errorLog as defaultErrorLog } from '../services/error-log.js';
import { authController as defaultAuthController } from './auth-controller.js';
import { reviewFormAccessibility as defaultReviewFormAccessibility } from '../views/review-form-accessibility.js';

const FINALITY_MESSAGE = 'This review was already submitted. Submissions are final.';
const VALIDATION_MESSAGE = 'Please fix validation errors before submitting.';
const CLOSED_MESSAGE = 'Review period is closed. View-only access.';
const UNAUTHORIZED_MESSAGE = 'You are not authorized to submit this review.';
const SAVE_FAILURE_MESSAGE = 'Review submission failed. Your draft was preserved.';
const CONFIRM_MESSAGE = 'Please confirm your submission is final.';
const SESSION_EXPIRED_MESSAGE = 'Session expired. Please log in again to submit your review.';

export function createReviewSubmissionController({
  formView,
  submissionView,
  validationView,
  errorSummaryView,
  sessionState,
  paperId,
  notificationsEnabled = false,
  reviewSubmissionService = defaultReviewSubmissionService,
  reviewValidationService = defaultReviewValidationService,
  errorLog = defaultErrorLog,
  authController = defaultAuthController,
  reviewFormAccessibility = defaultReviewFormAccessibility,
} = {}) {
  function getReviewerEmail() {
    const user = sessionState.getCurrentUser();
    return user && user.email ? user.email : null;
  }

  function requireAuth() {
    if (!sessionState.isAuthenticated()) {
      if (submissionView) {
        submissionView.setStatus(SESSION_EXPIRED_MESSAGE, true);
      }
      if (authController) {
        authController.requestLogin({ destination: 'review-submit', payload: { paperId } });
      }
      return false;
    }
    return true;
  }

  function handleSubmit(event) {
    const startTime = typeof performance !== 'undefined' ? performance.now() : null;
    event.preventDefault();
    if (!requireAuth()) {
      return;
    }

    if (validationView) {
      validationView.clear();
    }
    if (errorSummaryView) {
      errorSummaryView.clear();
    }

    if (formView && !formView.isConfirmed()) {
      if (submissionView) {
        submissionView.setStatus(CONFIRM_MESSAGE, true);
      }
      return;
    }

    const reviewerEmail = getReviewerEmail();
    const content = formView.getValues();

    const validation = reviewValidationService.validate({ content });
    if (!validation.ok) {
      if (submissionView) {
        submissionView.setStatus(VALIDATION_MESSAGE, true);
      }
      if (validationView) {
        Object.entries(validation.errors).forEach(([field, code]) => {
          validationView.setFieldError(field, `${field} ${code}`.replace('_', ' '));
        });
      }
      if (errorSummaryView) {
        errorSummaryView.setErrors(Object.keys(validation.errors));
      }
      if (reviewFormAccessibility && formView) {
        reviewFormAccessibility.focusFirstError(formView.element);
      }
      reviewSubmissionService.preserveDraft({
        paperId,
        reviewerEmail,
        content,
        errors: validation.errors,
      });
      return;
    }

    const result = reviewSubmissionService.submit({
      paperId,
      reviewerEmail,
      content,
      notificationsEnabled,
      errorLog,
    });

    if (!result.ok) {
      if (result.reason === 'duplicate') {
        submissionView.setFinalityMessage(FINALITY_MESSAGE);
        submissionView.setStatus(FINALITY_MESSAGE, true);
        return;
      }
      if (result.reason === 'closed') {
        if (formView) {
          formView.setViewOnly(true, CLOSED_MESSAGE);
        }
        submissionView.setStatus(CLOSED_MESSAGE, true);
        return;
      }
      if (result.reason === 'not_assigned' || result.reason === 'not_accepted') {
        submissionView.setStatus(UNAUTHORIZED_MESSAGE, true);
        return;
      }
      if (result.reason === 'validation_failed') {
        submissionView.setStatus(VALIDATION_MESSAGE, true);
        return;
      }
      submissionView.setStatus(SAVE_FAILURE_MESSAGE, true);
      reviewSubmissionService.preserveDraft({ paperId, reviewerEmail, content });
      return;
    }

    submissionView.setStatus('Review submitted successfully.', false);
    if (result.notificationStatus === 'failed') {
      submissionView.setNotificationWarning('Review submitted, but editor notification failed.');
    }

    if (startTime !== null && errorLog) {
      const elapsed = performance.now() - startTime;
      if (elapsed > 50) {
        errorLog.logFailure({
          errorType: 'review_submit_slow',
          message: `submission_handler_${Math.round(elapsed)}ms`,
          context: paperId,
        });
      }
    }
  }

  return {
    init() {
      if (formView) {
        formView.onSubmit(handleSubmit);
      }
    },
  };
}
