import { decisionRepository as defaultDecisionRepository } from '../services/decision_repository.js';
import { notificationService as defaultNotificationService } from '../services/notification_service.js';
import { auditLogService as defaultAuditLogService } from '../services/audit_log_service.js';
import { releaseScheduler as defaultReleaseScheduler } from '../services/release_scheduler.js';

export function createDecisionReleaseController({
  decisionRepository = defaultDecisionRepository,
  notificationService = defaultNotificationService,
  auditLogService = defaultAuditLogService,
  releaseScheduler = defaultReleaseScheduler,
} = {}) {
  function releaseNow({ paper, decision, authors } = {}) {
    decision.releasedAt = new Date().toISOString();
    decisionRepository.saveDecision(decision);
    const result = notificationService.sendDecisionNotifications({
      paper,
      decision,
      authors,
      auditLogService,
    });
    auditLogService.log({
      eventType: 'decision_released',
      relatedId: decision.decisionId,
      details: { paperId: paper.paperId || paper.id },
    });
    return result;
  }

  return {
    scheduleRelease({ paper, decision, authors, releaseAt } = {}) {
      if (!paper || !decision) {
        return { ok: false, reason: 'missing_payload' };
      }
      paper.decisionReleaseAt = releaseAt || paper.decisionReleaseAt || null;
      const schedule = releaseScheduler.schedule({
        releaseAt: paper.decisionReleaseAt,
        onRelease: () => releaseNow({ paper, decision, authors }),
      });
      return { ok: true, schedule };
    },
    releaseNow,
    releaseDecisionById(decisionId) {
      const decision = decisionRepository.getDecisionById(decisionId);
      if (!decision) {
        return { status: 409, reason: 'decision_missing' };
      }
      if (decision.releasedAt) {
        return { status: 409, reason: 'already_released' };
      }
      const paper = decisionRepository.getPaperById(decision.paperId) || { paperId: decision.paperId };
      if (!releaseScheduler.isReleased(paper.decisionReleaseAt)) {
        return { status: 409, reason: 'release_pending' };
      }
      releaseNow({ paper, decision, authors: [] });
      return { status: 200 };
    },
  };
}
