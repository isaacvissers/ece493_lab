import { authService as defaultAuthService } from '../services/auth_service.js';
import { decisionRepository as defaultDecisionRepository } from '../services/decision_repository.js';
import { auditLogService as defaultAuditLogService } from '../services/audit_log_service.js';

export function createDecisionController({
  listView,
  detailView,
  decisionRepository = defaultDecisionRepository,
  authService = defaultAuthService,
  sessionState,
  auditLogService = defaultAuditLogService,
  onAuthRequired = null,
} = {}) {
  let pendingPaperId = null;
  let refreshTimer = null;

  function getAuthorId() {
    const user = sessionState && sessionState.getCurrentUser ? sessionState.getCurrentUser() : null;
    return user && user.id ? user.id : null;
  }

  function requireAuth() {
    return authService.requireAuth({ sessionState, onAuthRequired });
  }

  function renderList() {
    if (!listView) {
      return;
    }
    const authorId = getAuthorId();
    const entries = decisionRepository.listDecisionsForAuthor({ authorId });
    listView.setDecisions(entries);
  }

  function clearRefreshTimer() {
    if (refreshTimer) {
      clearInterval(refreshTimer);
      refreshTimer = null;
    }
  }

  function scheduleRefresh(paperId) {
    clearRefreshTimer();
    refreshTimer = setInterval(() => {
      showDecision(paperId, { skipTimer: true });
    }, 60000);
  }

  function showDecision(paperId, { skipTimer = false } = {}) {
    clearRefreshTimer();
    const auth = requireAuth();
    if (!auth.ok) {
      pendingPaperId = paperId;
      return;
    }
    const authorId = getAuthorId();
    const result = decisionRepository.getDecisionForAuthor({ paperId, authorId });
    if (!detailView) {
      return;
    }
    if (!result.ok) {
      if (result.reason === 'pending') {
        detailView.setPending(result.paper && result.paper.decisionReleaseAt);
        if (!skipTimer) {
          scheduleRefresh(paperId);
        }
        return;
      }
      if (result.reason === 'access_denied' && auditLogService) {
        auditLogService.log({ eventType: 'access_denied', relatedId: paperId, details: { authorId } });
      }
      detailView.setStatus('Decision not available.', true);
      return;
    }
    detailView.setDecision({ paper: result.paper, decision: result.decision });
  }

  return {
    listView,
    detailView,
    init() {
      const auth = requireAuth();
      if (!auth.ok) {
        return;
      }
      if (listView) {
        listView.onSelect(showDecision);
      }
      renderList();
    },
    showDecision,
    resumePending() {
      if (pendingPaperId) {
        const paperId = pendingPaperId;
        pendingPaperId = null;
        showDecision(paperId);
      }
    },
    stopRefresh() {
      clearRefreshTimer();
    },
  };
}
