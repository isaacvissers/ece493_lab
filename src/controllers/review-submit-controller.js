import { reviewDeliveryService as defaultReviewDeliveryService } from '../services/review-delivery-service.js';
import { notificationService as defaultNotificationService } from '../services/notification-service.js';
import { auditLogService as defaultAuditLogService } from '../services/audit-log-service.js';
import { adminFlagService as defaultAdminFlagService } from '../services/admin-flag-service.js';

export function createReviewSubmitController({
  review,
  paper,
  deliveryService = defaultReviewDeliveryService,
  notificationService = defaultNotificationService,
  auditLogService = defaultAuditLogService,
  adminFlagService = defaultAdminFlagService,
  notificationsEnabled = false,
} = {}) {
  function submit() {
    if (!review || review.status !== 'submitted') {
      return { ok: false, reason: 'not_submitted' };
    }
    if (!paper || !paper.editorId) {
      adminFlagService.addFlag({ reviewId: review.reviewId, reason: 'missing_editor' });
      return { ok: false, reason: 'missing_editor' };
    }

    const delivery = deliveryService.deliverReview({
      reviewId: review.reviewId,
      editorId: paper.editorId,
    });

    auditLogService.log({
      eventType: 'delivery',
      relatedId: review.reviewId,
      details: delivery,
    });

    if (notificationsEnabled) {
      const notify = notificationService.sendReviewNotifications({
        reviewId: review.reviewId,
        editorId: paper.editorId,
        channels: ['email', 'in_app'],
      });
      auditLogService.log({
        eventType: 'notification',
        relatedId: review.reviewId,
        details: notify,
      });
      return { ok: delivery.ok, delivery, notify };
    }

    return { ok: delivery.ok, delivery };
  }

  return { submit };
}
