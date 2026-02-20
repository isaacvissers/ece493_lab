function generateNotificationId() {
  return `notif_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export function createNotificationLog({
  notificationId = null,
  scheduleId,
  status = 'pending',
  createdAt = null,
  details = null,
} = {}) {
  return {
    notificationId: notificationId || generateNotificationId(),
    scheduleId,
    status,
    details,
    createdAt: createdAt || new Date().toISOString(),
  };
}
