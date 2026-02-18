import { notificationService } from '../../src/services/notification-service.js';

beforeEach(() => {
  notificationService.clear();
});

test('sends notifications for both channels when enabled', () => {
  const result = notificationService.sendReviewNotifications({
    reviewId: 'rev_note',
    editorId: 'editor_1',
    channels: ['email', 'in_app'],
  });

  expect(result.ok).toBe(true);
  const log = notificationService.getReviewNotifications();
  expect(log[0].channels).toEqual(['email', 'in_app']);
});
