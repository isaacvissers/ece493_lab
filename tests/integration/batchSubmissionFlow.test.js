import { notificationService } from '../../src/services/notification-service.js';

beforeEach(() => {
  notificationService.clear();
});

test('batch submissions keep notifications grouped when enabled', () => {
  notificationService.setGroupingEnabled(true);
  notificationService.sendReviewNotifications({ reviewId: 'rev_b1', editorId: 'editor_1' });
  const shouldBatch = notificationService.shouldBatch(Date.now());
  expect(shouldBatch).toBe(true);
});
