import { NOTIFICATION_STATUS, NOTIFICATION_CHANNELS } from './delivery-constants.js';

function generateNotificationId() {
  return `note_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export function createNotification({
  notificationId = null,
  reviewId,
  editorId,
  paperId,
  decisionId,
  recipientId,
  channel = null,
  channels = [NOTIFICATION_CHANNELS.email, NOTIFICATION_CHANNELS.inApp],
  status = NOTIFICATION_STATUS.sent,
  sentAt = null,
  reason = null,
} = {}) {
  const resolvedChannels = channel ? [channel] : channels;
  return {
    notificationId: notificationId || generateNotificationId(),
    reviewId: reviewId || decisionId,
    editorId: editorId || paperId,
    paperId,
    decisionId,
    recipientId,
    channel,
    channels: Array.isArray(resolvedChannels) ? resolvedChannels : [],
    status,
    sentAt: sentAt || new Date().toISOString(),
    reason,
  };
}
