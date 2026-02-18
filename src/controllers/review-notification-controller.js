import { notificationService as defaultNotificationService } from '../services/notification-service.js';

export function createReviewNotificationController({
  reviewId,
  editorId,
  notificationService = defaultNotificationService,
} = {}) {
  return {
    send() {
      return notificationService.sendReviewNotifications({
        reviewId,
        editorId,
        channels: ['email', 'in_app'],
      });
    },
  };
}
