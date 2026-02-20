import { createDecisionReleaseController } from '../../src/controllers/decision_release_controller.js';
import { decisionRepository } from '../../src/services/decision_repository.js';
import { notificationService } from '../../src/services/notification_service.js';
import { auditLogService } from '../../src/services/audit_log_service.js';

beforeEach(() => {
  decisionRepository.reset();
  notificationService.reset();
  auditLogService.reset();
});

test('scheduleRelease rejects missing payload', () => {
  const controller = createDecisionReleaseController({ decisionRepository, notificationService, auditLogService });
  const result = controller.scheduleRelease();
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('missing_payload');
});

test('releaseNow logs decision release', () => {
  const controller = createDecisionReleaseController({ decisionRepository, notificationService, auditLogService });
  controller.releaseNow({
    paper: { paperId: 'paper_release' },
    decision: { decisionId: 'decision_release', paperId: 'paper_release' },
    authors: [],
  });
  const logs = auditLogService.getLogs();
  expect(logs.some((log) => log.eventType === 'decision_released')).toBe(true);
});
