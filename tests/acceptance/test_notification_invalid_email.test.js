import { notificationService } from '../../src/services/notification_service.js';
import { notificationPrefs } from '../../src/services/notification_prefs.js';
import { auditLogService } from '../../src/services/audit_log_service.js';

beforeEach(() => {
  notificationService.reset();
  notificationPrefs.reset();
  auditLogService.reset();
});

test('falls back to in-app when email invalid and in-app enabled', () => {
  notificationPrefs.setPreferences('author_3', { email: true, inApp: true });
  const result = notificationService.sendDecisionNotifications({
    paper: { paperId: 'paper_3' },
    decision: { decisionId: 'decision_3' },
    authors: [{ authorId: 'author_3', email: 'invalid-email' }],
    auditLogService,
  });

  expect(result.ok).toBe(true);
  const notifications = notificationService.getNotifications();
  expect(notifications).toHaveLength(1);
  expect(notifications[0].channel).toBe('in_app');
  const logs = auditLogService.getLogs();
  expect(logs.some((log) => log.details.reason === 'invalid_email')).toBe(true);
});
