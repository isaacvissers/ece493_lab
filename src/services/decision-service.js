import { decisionEligibilityService as defaultEligibilityService } from './decision-eligibility-service.js';
import { assignmentStorage as defaultAssignmentStorage } from './assignment-storage.js';
import { auditLogService as defaultAuditLogService } from './audit-log-service.js';
import { authorNotificationService as defaultAuthorNotificationService } from './author-notification-service.js';
import { createDecision } from '../models/decision.js';
import { DECISION_VALUES, DECISION_STATUSES, REQUIRED_REVIEW_COUNT } from '../models/decision-constants.js';

const DECISIONS_KEY = 'cms.decisions';
let cachedDecisions = null;

function loadDecisions() {
  if (cachedDecisions) {
    return cachedDecisions;
  }
  const raw = localStorage.getItem(DECISIONS_KEY);
  cachedDecisions = raw ? JSON.parse(raw) : [];
  return cachedDecisions;
}

function persistDecisions(decisions) {
  localStorage.setItem(DECISIONS_KEY, JSON.stringify(decisions));
  cachedDecisions = decisions;
}

function normalizeDecisionValue(value) {
  if (!value) {
    return '';
  }
  const normalized = `${value}`.trim().toLowerCase();
  return DECISION_VALUES[normalized] || normalized;
}

export const decisionService = {
  reset() {
    cachedDecisions = null;
    localStorage.removeItem(DECISIONS_KEY);
  },
  getDecisionForPaper(paperId) {
    if (!paperId) {
      return null;
    }
    return loadDecisions().find((decision) => decision.paperId === paperId) || null;
  },
  saveDecision({
    paperId,
    editorId,
    value,
    comments = '',
    eligibilityService = defaultEligibilityService,
    assignmentStorage = defaultAssignmentStorage,
    auditLogService = defaultAuditLogService,
    authorNotificationService = defaultAuthorNotificationService,
  } = {}) {
    const paper = assignmentStorage.getPaper(paperId);
    if (!paper) {
      return { ok: false, reason: 'paper_not_found' };
    }

    if (paper.editorId && editorId && paper.editorId !== editorId) {
      if (auditLogService) {
        auditLogService.log({
          eventType: 'auth_failed',
          relatedId: paperId,
          details: { editorId },
        });
      }
      return { ok: false, reason: 'unauthorized' };
    }

    if (decisionService.getDecisionForPaper(paperId)) {
      return { ok: false, reason: 'decision_exists' };
    }

    const reviewCount = eligibilityService.getReviewCount(paperId);
    if (reviewCount !== REQUIRED_REVIEW_COUNT) {
      return { ok: false, reason: 'review_count_invalid', reviewCount };
    }

    const normalizedValue = normalizeDecisionValue(value);
    if (![DECISION_VALUES.accept, DECISION_VALUES.reject].includes(normalizedValue)) {
      return { ok: false, reason: 'invalid_value' };
    }

    const decision = createDecision({
      paperId,
      editorId,
      value: normalizedValue,
      comments,
    });

    const decisions = loadDecisions().slice();
    decisions.push(decision);
    persistDecisions(decisions);

    try {
      const status = normalizedValue === DECISION_VALUES.accept
        ? DECISION_STATUSES.accepted
        : DECISION_STATUSES.rejected;
      assignmentStorage.updatePaperStatus({ paperId, status });
    } catch (error) {
      const rollback = loadDecisions().filter((entry) => entry.decisionId !== decision.decisionId);
      persistDecisions(rollback);
      if (auditLogService) {
        auditLogService.log({
          eventType: 'decision_failed',
          relatedId: paperId,
          details: { reason: 'paper_update_failed' },
        });
      }
      return { ok: false, reason: 'paper_update_failed' };
    }

    if (auditLogService) {
      auditLogService.log({
        eventType: 'decision_saved',
        relatedId: paperId,
        details: { value: normalizedValue },
      });
    }

    if (authorNotificationService) {
      const notification = authorNotificationService.notifyDecision({
        paperId,
        decisionId: decision.decisionId,
      });
      if (notification && !notification.ok && auditLogService) {
        auditLogService.log({
          eventType: 'notification_failed',
          relatedId: decision.decisionId,
          details: { reason: 'notification_failed' },
        });
      }
    }

    return { ok: true, decision };
  },
};
