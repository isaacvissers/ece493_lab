import { createNotification } from '../models/notification.js';

const NOTIFICATIONS_KEY = 'cms.decision_notifications';

let cachedNotifications = null;
let failureMode = false;

function loadNotifications() {
  if (cachedNotifications) {
    return cachedNotifications;
  }
  const raw = localStorage.getItem(NOTIFICATIONS_KEY);
  cachedNotifications = raw ? JSON.parse(raw) : [];
  return cachedNotifications;
}

function persistNotifications(entries) {
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(entries));
  cachedNotifications = entries;
}

export const authorNotificationService = {
  setFailureMode(enabled) {
    failureMode = Boolean(enabled);
  },
  reset() {
    failureMode = false;
    cachedNotifications = null;
    localStorage.removeItem(NOTIFICATIONS_KEY);
  },
  notifyDecision({ paperId, decisionId } = {}) {
    if (failureMode) {
      return { ok: false, status: 'failed' };
    }
    const entries = loadNotifications().slice();
    entries.push(createNotification({
      reviewId: decisionId,
      editorId: paperId,
      status: 'sent',
    }));
    persistNotifications(entries);
    return { ok: true, status: 'sent' };
  },
  getNotifications() {
    return loadNotifications().slice();
  },
};
