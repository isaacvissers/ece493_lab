import { NOTIFICATION_STATUS, NOTIFICATION_CHANNELS } from './delivery-constants.js';

function generateNotificationId() {
  return `note_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export function createNotification({
  notificationId = null,
  reviewId,
  editorId,
  channels = [NOTIFICATION_CHANNELS.email, NOTIFICATION_CHANNELS.inApp],
  status = NOTIFICATION_STATUS.sent,
  sentAt = null,
  reason = null,
} = {}) {
  return {
    notificationId: notificationId || generateNotificationId(),
    reviewId,
    editorId,
    channels: Array.isArray(channels) ? channels : [],
    status,
    sentAt: sentAt || new Date().toISOString(),
    reason,
  };
}
