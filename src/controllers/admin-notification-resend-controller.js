import { notificationService as defaultNotificationService } from '../services/notification-service.js';
import { adminFlagService as defaultAdminFlagService } from '../services/admin-flag-service.js';

export function createAdminNotificationResendController({
  notificationService = defaultNotificationService,
  adminFlagService = defaultAdminFlagService,
} = {}) {
  return {
    resend(flag) {
      const result = notificationService.sendReviewNotifications({
        reviewId: flag.reviewId,
        editorId: flag.editorId || null,
        channels: ['email', 'in_app'],
      });
      if (result.ok) {
        adminFlagService.resolveFlag(flag.flagId);
      }
      return result;
    },
  };
}
