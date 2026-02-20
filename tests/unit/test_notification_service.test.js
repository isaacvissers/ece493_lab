import { notificationService } from '../../src/services/notification_service.js';
import { notificationPrefs } from '../../src/services/notification_prefs.js';
import { auditLogService } from '../../src/services/audit_log_service.js';

beforeEach(() => {
  notificationService.reset();
  notificationPrefs.reset();
  auditLogService.reset();
});

test('returns error when payload missing', () => {
  const result = notificationService.sendDecisionNotifications();
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('missing_payload');
});

test('handles in-app failure mode', () => {
  notificationPrefs.setPreferences('author_5', { email: false, inApp: true });
  notificationService.setFailureMode({ inApp: true });

  const result = notificationService.sendDecisionNotifications({
    paper: { paperId: 'paper_5' },
    decision: { decisionId: 'decision_5' },
    authors: [{ authorId: 'author_5', email: 'author5@example.com' }],
    auditLogService,
  });

  expect(result.ok).toBe(true);
  const notifications = notificationService.getNotifications();
  expect(notifications[0].status).toBe('failed');
});

test('records sent notifications for multiple authors', () => {
  notificationPrefs.setPreferences('author_6', { email: true, inApp: false });
  notificationPrefs.setPreferences('author_7', { email: false, inApp: true });

  const result = notificationService.sendDecisionNotifications({
    paper: { paperId: 'paper_6' },
    decision: { decisionId: 'decision_6' },
    authors: [
      { authorId: 'author_6', email: 'author6@example.com' },
      { authorId: 'author_7', email: 'author7@example.com' },
    ],
  });

  expect(result.ok).toBe(true);
  expect(notificationService.getNotifications()).toHaveLength(2);
});
