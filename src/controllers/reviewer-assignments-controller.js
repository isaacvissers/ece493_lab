import { reviewerAssignments as defaultReviewerAssignments } from '../services/reviewer-assignments.js';
import { errorLog as defaultErrorLog } from '../services/error-log.js';
import { authController as defaultAuthController } from './auth-controller.js';

const AUTH_MESSAGE = 'Please log in to view your assigned papers.';
const RETRIEVAL_MESSAGE = 'Assignments could not be loaded. Please try again.';

export function createReviewerAssignmentsController({
  view,
  sessionState,
  reviewerAssignments = defaultReviewerAssignments,
  errorLog = defaultErrorLog,
  authController = defaultAuthController,
  onOpenPaper,
} = {}) {
  function getReviewerEmail() {
    const user = sessionState.getCurrentUser();
    return user && user.email ? user.email : null;
  }

  function requireAuth() {
    if (!sessionState.isAuthenticated()) {
      view.setStatus(AUTH_MESSAGE, true);
      if (authController) {
        authController.requestLogin({ destination: 'reviewer-assignments' });
      }
      return false;
    }
    return true;
  }

  function loadAssignments() {
    view.setStatus('', false);
    if (!requireAuth()) {
      return;
    }
    const reviewerEmail = getReviewerEmail();
    const result = reviewerAssignments.listAcceptedAssignments({ reviewerEmail, errorLog });
    if (!result.ok) {
      view.setStatus(RETRIEVAL_MESSAGE, true);
      return;
    }
    view.setAssignments(result.assignments);
    view.setStatus('Assigned papers loaded.', false);
  }

  return {
    init() {
      view.onRefresh(loadAssignments);
      view.onOpen((assignment) => {
        if (onOpenPaper) {
          onOpenPaper(assignment);
        }
      });
      loadAssignments();
    },
    refresh() {
      loadAssignments();
    },
  };
}
