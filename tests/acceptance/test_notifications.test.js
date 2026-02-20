import { notificationService } from '../../src/services/notification_service.js';
import { notificationPrefs } from '../../src/services/notification_prefs.js';

beforeEach(() => {
  notificationService.reset();
  notificationPrefs.reset();
});

test('delivers notification when enabled', () => {
  notificationPrefs.setPreferences('author_1', { email: true, inApp: false });
  const result = notificationService.sendDecisionNotifications({
    paper: { paperId: 'paper_1' },
    decision: { decisionId: 'decision_1' },
    authors: [{ authorId: 'author_1', email: 'author@example.com' }],
  });

  expect(result.ok).toBe(true);
  const notifications = notificationService.getNotifications();
  expect(notifications).toHaveLength(1);
  expect(notifications[0].channel).toBe('email');
});
