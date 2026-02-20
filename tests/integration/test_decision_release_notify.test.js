import { createDecisionReleaseController } from '../../src/controllers/decision_release_controller.js';
import { decisionRepository } from '../../src/services/decision_repository.js';
import { notificationService } from '../../src/services/notification_service.js';
import { notificationPrefs } from '../../src/services/notification_prefs.js';
import { auditLogService } from '../../src/services/audit_log_service.js';

beforeEach(() => {
  decisionRepository.reset();
  notificationService.reset();
  notificationPrefs.reset();
  auditLogService.reset();
});

test('release controller triggers notifications on release', () => {
  notificationPrefs.setPreferences('author_release', { email: true, inApp: false });
  const controller = createDecisionReleaseController({
    decisionRepository,
    notificationService,
    auditLogService,
  });

  const paper = { paperId: 'paper_release', authorIds: ['author_release'] };
  const decision = { decisionId: 'decision_release', paperId: 'paper_release', value: 'accept' };
  const authors = [{ authorId: 'author_release', email: 'author@example.com' }];

  controller.releaseNow({ paper, decision, authors });
  const notifications = notificationService.getNotifications();
  expect(notifications).toHaveLength(1);
  expect(notifications[0].decisionId).toBe('decision_release');
});
