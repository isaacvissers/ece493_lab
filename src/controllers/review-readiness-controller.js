import { UI_MESSAGES } from '../services/ui-messages.js';
import { refereeReadiness as defaultReadiness } from '../services/referee-readiness.js';
import { refereeGuidance as defaultGuidance } from '../services/referee-guidance.js';
import { errorLog as defaultErrorLog } from '../services/error-log.js';

const AUTH_MESSAGE = 'You do not have permission to start review.';
const MISSING_PAPER_MESSAGE = 'Paper not found.';
const COUNT_FAILURE_MESSAGE = 'Unable to determine referee count. Please try again.';

export function createReviewReadinessController({
  view,
  guidanceView = null,
  assignmentStorage,
  reviewRequestStore,
  sessionState,
  paperId,
  readinessService = defaultReadiness,
  guidanceService = defaultGuidance,
  errorLog = defaultErrorLog,
  onGuidanceAction,
  onAuthRequired,
} = {}) {
  let currentPaper = null;

  function isEditor(user) {
    if (!user || !user.role) {
      return false;
    }
    return user.role.toLowerCase() === 'editor';
  }

  function loadPaper() {
    const paper = assignmentStorage.getPaper(paperId);
    currentPaper = paper;
    if (!paper) {
      view.setStatus(MISSING_PAPER_MESSAGE, true);
      return false;
    }
    view.setPaper(paper);
    return true;
  }

  function applyAuthGuard() {
    if (!sessionState.isAuthenticated()) {
      view.setStatus(UI_MESSAGES.errors.accessDenied.message, true);
      if (onAuthRequired) {
        onAuthRequired();
      }
      return false;
    }
    const user = sessionState.getCurrentUser();
    if (!isEditor(user)) {
      view.setAuthorizationMessage(AUTH_MESSAGE);
      return false;
    }
    view.setAuthorizationMessage('');
    return true;
  }

  function evaluateReadiness() {
    view.setStatus('', false);
    view.setMissingInvitations([]);
    view.setGuidance('');
    if (guidanceView) {
      guidanceView.setGuidance({ message: '', actionLabel: '', action: null });
    }

    if (!applyAuthGuard()) {
      return { ok: false, ready: false, reason: 'unauthorized' };
    }
    if (!currentPaper && !loadPaper()) {
      return { ok: false, ready: false, reason: 'paper_not_found' };
    }

    const result = readinessService.evaluate({
      paperId: currentPaper.id,
      assignmentStorage,
      reviewRequestStore,
      errorLog,
    });

    if (!result.ok) {
      view.setStatus(COUNT_FAILURE_MESSAGE, true);
      view.setCount(null);
      return result;
    }

    view.setCount(result.count);
    if (result.ready) {
      view.setStatus('Paper is ready for review.', false);
    } else {
      view.setStatus(`Review blocked. Paper has ${result.count} non-declined referee assignments.`, true);
      if (guidanceService && guidanceView) {
        const guidance = guidanceService.getGuidance({ count: result.count });
        if (guidance) {
          guidanceView.setGuidance(guidance);
        }
      }
    }
    if (result.missingInvitations && result.missingInvitations.length) {
      view.setMissingInvitations(result.missingInvitations);
    }
    return result;
  }

  return {
    init() {
      loadPaper();
      if (guidanceView && onGuidanceAction) {
        guidanceView.onAction(onGuidanceAction);
      }
    },
    evaluateReadiness,
  };
}
