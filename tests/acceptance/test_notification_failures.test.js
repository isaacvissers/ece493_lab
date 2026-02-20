import { notificationService } from '../../src/services/notification_service.js';
import { notificationPrefs } from '../../src/services/notification_prefs.js';
import { auditLogService } from '../../src/services/audit_log_service.js';

beforeEach(() => {
  notificationService.reset();
  notificationPrefs.reset();
  auditLogService.reset();
});

test('logs notification failure without blocking decisions', () => {
  notificationPrefs.setPreferences('author_2', { email: true, inApp: true });
  notificationService.setFailureMode({ email: true, inApp: true });

  const result = notificationService.sendDecisionNotifications({
    paper: { paperId: 'paper_2' },
    decision: { decisionId: 'decision_2' },
    authors: [{ authorId: 'author_2', email: 'author2@example.com' }],
    auditLogService,
  });

  expect(result.ok).toBe(true);
  const logs = auditLogService.getLogs();
  expect(logs.some((log) => log.eventType === 'notification_failed')).toBe(true);
});
