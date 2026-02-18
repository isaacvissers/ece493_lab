import { notificationService } from '../../src/services/notification-service.js';

beforeEach(() => {
  notificationService.clear();
});

test('batching window applies when grouping enabled', () => {
  notificationService.setGroupingEnabled(true);
  notificationService.sendReviewNotifications({ reviewId: 'rev_batch', editorId: 'editor_1' });
  expect(notificationService.shouldBatch(Date.now())).toBe(true);
});
