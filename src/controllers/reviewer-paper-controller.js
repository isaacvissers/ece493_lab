import { reviewerPaperAccess as defaultPaperAccess } from '../services/reviewer-paper-access.js';
import { errorLog as defaultErrorLog } from '../services/error-log.js';
import { authController as defaultAuthController } from './auth-controller.js';

const AUTH_MESSAGE = 'Please log in to view the paper.';
const NOT_ACCEPTED_MESSAGE = 'Access denied. You must accept the assignment to view this paper.';
const UNAVAILABLE_MESSAGE = 'This paper or manuscript is unavailable.';
const RETRIEVAL_MESSAGE = 'Paper details could not be loaded. Please try again.';

export function createReviewerPaperController({
  view,
  sessionState,
  reviewerEmail = null,
  paperId,
  paperAccess = defaultPaperAccess,
  errorLog = defaultErrorLog,
  authController = defaultAuthController,
} = {}) {
  function getReviewerEmail() {
    if (reviewerEmail) {
      return reviewerEmail;
    }
    const user = sessionState.getCurrentUser();
    return user && user.email ? user.email : null;
  }

  function requireAuth() {
    if (!sessionState.isAuthenticated()) {
      view.setStatus(AUTH_MESSAGE, true);
      if (authController) {
        authController.requestLogin({ destination: 'reviewer-paper', payload: { paperId } });
      }
      return false;
    }
    return true;
  }

  function loadPaper() {
    view.setStatus('', false);
    if (!requireAuth()) {
      return;
    }
    const email = getReviewerEmail();
    const result = paperAccess.getPaperDetails({ reviewerEmail: email, paperId, errorLog });
    if (!result.ok) {
      if (result.reason === 'not_accepted') {
        view.setStatus(NOT_ACCEPTED_MESSAGE, true);
        return;
      }
      if (result.reason === 'unavailable') {
        view.setStatus(UNAVAILABLE_MESSAGE, true);
        return;
      }
      view.setStatus(RETRIEVAL_MESSAGE, true);
      return;
    }
    view.setPaper(result.paper, result.manuscript);
    view.setStatus('Paper loaded.', false);
  }

  return {
    init() {
      loadPaper();
    },
  };
}
