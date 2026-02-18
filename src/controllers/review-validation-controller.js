import { reviewValidationService as defaultReviewValidationService } from '../services/review-validation-service.js';
import { validationRulesService as defaultValidationRulesService } from '../services/validation-rules-service.js';
import { reviewStorageService as defaultReviewStorageService } from '../services/review-storage-service.js';
import { errorLog as defaultErrorLog } from '../services/error-log.js';
import { FIELD_LABELS } from '../models/validation-constants.js';
import { reviewValidationAccessibility as defaultReviewValidationAccessibility } from '../views/review-validation-accessibility.js';

const RULES_UNAVAILABLE_MESSAGE = 'Validation rules are unavailable. Please try again later.';
const STORAGE_FAILURE_MESSAGE = 'We could not save your review. Please try again.';
const VALIDATION_FAILURE_MESSAGE = 'Please correct the highlighted errors.';

function buildErrorList(errors = {}, messages = {}) {
  return Object.keys(errors).map((field) => ({
    field,
    message: messages[field] || `${FIELD_LABELS[field] || field} is invalid.`,
  }));
}

export function createReviewValidationController({
  view,
  summaryView,
  formId,
  reviewerEmail = null,
  sessionState = null,
  reviewValidationService = defaultReviewValidationService,
  validationRulesService = defaultValidationRulesService,
  reviewStorageService = defaultReviewStorageService,
  errorLog = defaultErrorLog,
  reviewValidationAccessibility = defaultReviewValidationAccessibility,
} = {}) {
  function getReviewerEmail() {
    if (reviewerEmail) {
      return reviewerEmail;
    }
    if (sessionState) {
      const user = sessionState.getCurrentUser();
      return user && user.email ? user.email : null;
    }
    return null;
  }

  function handleAction(action) {
    const startTime = typeof performance !== 'undefined' ? performance.now() : null;
    if (view) {
      view.clearErrors();
      view.setStatus('', false);
    }
    if (summaryView) {
      summaryView.clear();
    }

    const rules = validationRulesService.getRules({ formId });
    if (!rules.ok) {
      if (view) {
        view.setStatus(RULES_UNAVAILABLE_MESSAGE, true);
      }
      return;
    }

    const content = view.getValues();
    const validation = reviewValidationService.validate({
      content,
      requiredFields: rules.rules.requiredFields,
      maxLengths: rules.rules.maxLengths,
      invalidCharacterPolicy: rules.rules.invalidCharacterPolicy,
      action,
    });

    if (!validation.ok) {
      const errorList = buildErrorList(validation.errors, validation.messages);
      if (summaryView) {
        summaryView.setErrors(errorList);
      }
      if (view) {
        errorList.forEach((entry) => {
          view.setFieldError(entry.field, entry.message);
        });
        view.setStatus(VALIDATION_FAILURE_MESSAGE, true);
      }
      if (reviewValidationAccessibility && view) {
        reviewValidationAccessibility.focusFirstError(view.element);
      }
      return;
    }

    try {
      if (action === 'save_draft') {
        reviewStorageService.saveDraft({
          formId,
          reviewerEmail: getReviewerEmail(),
          content,
        });
        view.setStatus('Draft saved successfully.', false);
      } else {
        reviewStorageService.submitReview({
          formId,
          reviewerEmail: getReviewerEmail(),
          content,
        });
        view.setStatus('Review submitted successfully.', false);
      }
    } catch (error) {
      if (errorLog) {
        errorLog.logFailure({
          errorType: 'review_storage_failure',
          message: error && error.message ? error.message : 'review_storage_failed',
          context: formId,
        });
      }
      view.setStatus(STORAGE_FAILURE_MESSAGE, true);
      return;
    }

    if (startTime !== null && errorLog) {
      const elapsed = performance.now() - startTime;
      if (elapsed > 200) {
        errorLog.logFailure({
          errorType: 'review_validation_slow',
          message: `validation_${Math.round(elapsed)}ms`,
          context: formId,
        });
      }
    }
  }

  return {
    init() {
      if (!view) {
        return;
      }
      view.onSaveDraft((event) => {
        event.preventDefault();
        handleAction('save_draft');
      });
      view.onSubmitReview((event) => {
        event.preventDefault();
        handleAction('submit_review');
      });
    },
  };
}
