import { notificationService } from '../../src/services/notification_service.js';
import { notificationPrefs } from '../../src/services/notification_prefs.js';

beforeEach(() => {
  notificationService.reset();
  notificationPrefs.reset();
});

test('skips notifications when channels disabled', () => {
  notificationPrefs.setPreferences('author_4', { email: false, inApp: false });
  const result = notificationService.sendDecisionNotifications({
    paper: { paperId: 'paper_4' },
    decision: { decisionId: 'decision_4' },
    authors: [{ authorId: 'author_4', email: 'author4@example.com' }],
  });

  expect(result.ok).toBe(true);
  const notifications = notificationService.getNotifications();
  expect(notifications).toHaveLength(0);
});
