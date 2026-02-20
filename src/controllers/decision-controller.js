import { decisionEligibilityService as defaultEligibilityService } from '../services/decision-eligibility-service.js';
import { decisionService as defaultDecisionService } from '../services/decision-service.js';
import { assignmentStorage as defaultAssignmentStorage } from '../services/assignment-storage.js';
import { auditLogService as defaultAuditLogService } from '../services/audit-log-service.js';
import { authorNotificationService as defaultAuthorNotificationService } from '../services/author-notification-service.js';
import { validateDecisionSelection } from '../services/decision-selection-validation.js';
import { REQUIRED_REVIEW_COUNT } from '../models/decision-constants.js';
import { authController as defaultAuthController } from './auth-controller.js';

const INVALID_COUNT_MESSAGE = (count) => (
  `Decision entry is available only after exactly ${REQUIRED_REVIEW_COUNT} reviews. Current: ${count}.`
);
const MISSING_SELECTION_MESSAGE = 'Please select accept or reject before saving.';
const SESSION_EXPIRED_MESSAGE = 'Session expired. Please log in again.';
const SAVE_FAILURE_MESSAGE = 'Decision could not be saved. Please try again.';

export function createDecisionController({
  view,
  paperId,
  sessionState,
  assignmentStorage = defaultAssignmentStorage,
  decisionEligibilityService = defaultEligibilityService,
  decisionService = defaultDecisionService,
  auditLogService = defaultAuditLogService,
  authorNotificationService = defaultAuthorNotificationService,
  authController = defaultAuthController,
} = {}) {
  function getCurrentEditor() {
    const user = sessionState && sessionState.getCurrentUser ? sessionState.getCurrentUser() : null;
    return user && user.id ? user : null;
  }

  function requireAuth() {
    if (!sessionState || !sessionState.isAuthenticated || !sessionState.isAuthenticated()) {
      if (view && view.setStatus) {
        view.setStatus(SESSION_EXPIRED_MESSAGE, true);
      }
      if (authController) {
        authController.requestLogin({ destination: 'decision-entry', payload: { paperId } });
      }
      return false;
    }
    return true;
  }

  function updateEligibilityState() {
    const count = decisionEligibilityService.getReviewCount(paperId);
    const eligible = count === REQUIRED_REVIEW_COUNT;
    if (!eligible && view && view.setStatus) {
      view.setStatus(INVALID_COUNT_MESSAGE(count), true);
    }
    if (view && view.setSubmitDisabled) {
      view.setSubmitDisabled(!eligible);
    }
  }

  function renderReviews() {
    if (!view || !view.setReviews) {
      return;
    }
    const reviews = decisionEligibilityService.getSubmittedReviews(paperId);
    view.setReviews(reviews);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!requireAuth()) {
      return;
    }

    const selection = view.getSelection();
    const validation = validateDecisionSelection(selection);
    if (!validation.ok) {
      if (view && view.setStatus) {
        view.setStatus(MISSING_SELECTION_MESSAGE, true);
      }
      return;
    }

    const editor = getCurrentEditor();
    const result = decisionService.saveDecision({
      paperId,
      editorId: editor ? editor.id : null,
      value: validation.value,
      comments: view.getComments ? view.getComments() : '',
      eligibilityService: decisionEligibilityService,
      assignmentStorage,
      auditLogService,
      authorNotificationService,
    });

    if (!result.ok) {
      const message = result.reason === 'review_count_invalid'
        ? INVALID_COUNT_MESSAGE(result.reviewCount)
        : SAVE_FAILURE_MESSAGE;
      if (view && view.setStatus) {
        view.setStatus(message, true);
      }
      if (view && view.setSubmitDisabled && result.reason === 'review_count_invalid') {
        view.setSubmitDisabled(true);
      }
      return;
    }

    if (view && view.setStatus) {
      view.setStatus('Decision saved.', false);
    }
  }

  return {
    init() {
      if (!view) {
        return;
      }
      updateEligibilityState();
      renderReviews();
      if (view.onSubmit) {
        view.onSubmit(handleSubmit);
      }
    },
  };
}
