function generateNotificationId() {
  return `notif_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export function createNotificationLog({
  notificationId = null,
  paperId,
  reviewerEmail,
  status,
  createdAt = null,
  message = '',
} = {}) {
  return {
    notificationId: notificationId || generateNotificationId(),
    paperId,
    reviewerEmail,
    status,
    message,
    createdAt: createdAt || new Date().toISOString(),
  };
}
