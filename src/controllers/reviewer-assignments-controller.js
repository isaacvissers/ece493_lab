import { reviewerAssignments as defaultReviewerAssignments } from '../services/reviewer-assignments.js';
import { errorLog as defaultErrorLog } from '../services/error-log.js';
import { authController as defaultAuthController } from './auth-controller.js';
import { overassignmentCheck as defaultOverassignmentCheck } from '../services/overassignment-check.js';
import { overassignmentAlert as defaultOverassignmentAlert } from '../services/overassignment-alert.js';

const AUTH_MESSAGE = 'Please log in to view your assigned papers.';
const RETRIEVAL_MESSAGE = 'Assignments could not be loaded. Please try again.';

export function createReviewerAssignmentsController({
  view,
  sessionState,
  reviewerAssignments = defaultReviewerAssignments,
  errorLog = defaultErrorLog,
  authController = defaultAuthController,
  overassignmentCheck = defaultOverassignmentCheck,
  overassignmentAlert = defaultOverassignmentAlert,
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
    if (view.setAlert) {
      const alerted = new Set();
      result.assignments.forEach((assignment) => {
        if (!assignment || alerted.has(assignment.paperId)) {
          return;
        }
        const check = overassignmentCheck.evaluate({ paperId: assignment.paperId, errorLog });
        if (check.ok && check.overassigned) {
          const alertPayload = overassignmentAlert.build({ count: check.count });
          const rendered = view.setAlert({ message: alertPayload.message });
          if (!rendered && view.setAlertFallback) {
            view.setAlertFallback('Over-assignment detected but alert could not be displayed.');
            if (errorLog) {
              errorLog.logFailure({
                errorType: 'overassignment_alert_failure',
                message: 'alert_render_failed',
                context: assignment.paperId,
              });
            }
          }
          alerted.add(assignment.paperId);
        }
      });
    }
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
