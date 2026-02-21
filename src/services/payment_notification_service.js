import { paymentStorage } from './storage.js';

const NOTIFICATIONS_KEY = 'cms.payment_notifications';

let failureMode = false;

function loadNotifications() {
  return paymentStorage.read(NOTIFICATIONS_KEY, []);
}

function persistNotifications(notifications) {
  paymentStorage.write(NOTIFICATIONS_KEY, notifications);
}

export const paymentNotificationService = {
  setFailureMode(enabled) {
    failureMode = Boolean(enabled);
  },
  reset() {
    failureMode = false;
    paymentStorage.remove(NOTIFICATIONS_KEY);
  },
  sendPaymentConfirmation({ registrationId = null, receipt = null } = {}) {
    if (failureMode) {
      return { ok: false, reason: 'notification_failed' };
    }
    const notifications = loadNotifications().slice();
    const base = {
      registrationId,
      receiptRef: receipt && receipt.reference ? receipt.reference : null,
      createdAt: new Date().toISOString(),
    };
    notifications.push({ ...base, channel: 'email' });
    notifications.push({ ...base, channel: 'in_app' });
    persistNotifications(notifications);
    return { ok: true };
  },
  getNotifications() {
    return loadNotifications().slice();
  },
};
