import { createNotificationLogEntry } from '../models/notification-log.js';

const notificationLog = [];
let failureMode = false;
let retryFailureMode = false;
let reviewFailureMode = false;
let notificationsEnabled = true;
let groupingEnabled = false;
let lastSentAt = null;
const BATCH_WINDOW_MS = 5 * 60 * 1000;
const RETRY_DELAYS_MS = [60 * 1000, 5 * 60 * 1000, 15 * 60 * 1000];

export const notificationService = {
  setFailureMode(enabled) {
    failureMode = Boolean(enabled);
  },
  setRetryFailureMode(enabled) {
    retryFailureMode = Boolean(enabled);
  },
  setReviewFailureMode(enabled) {
    reviewFailureMode = Boolean(enabled);
  },
  setNotificationsEnabled(enabled) {
    notificationsEnabled = Boolean(enabled);
  },
  setGroupingEnabled(enabled) {
    groupingEnabled = Boolean(enabled);
  },
  getRetryDelays() {
    return RETRY_DELAYS_MS.slice();
  },
  shouldBatch(now = Date.now()) {
    if (!groupingEnabled || !lastSentAt) {
      return false;
    }
    return now - lastSentAt < BATCH_WINDOW_MS;
  },
  clear() {
    notificationLog.length = 0;
    failureMode = false;
    retryFailureMode = false;
    reviewFailureMode = false;
    notificationsEnabled = true;
    groupingEnabled = false;
    lastSentAt = null;
  },
  getLog() {
    return notificationLog.slice();
  },
  sendReviewNotifications({ reviewId, editorId, channels = ['email', 'in_app'] } = {}) {
    if (!notificationsEnabled) {
      return { ok: false, reason: 'disabled' };
    }
    if (reviewFailureMode) {
      notificationLog.push({
        reviewId,
        editorId,
        channels,
        status: 'failed',
        errorMessage: 'service_unavailable',
        attemptedAt: new Date().toISOString(),
      });
      return { ok: false, reason: 'service_unavailable' };
    }
    const entry = {
      reviewId,
      editorId,
      channels,
      status: 'sent',
      attemptedAt: new Date().toISOString(),
    };
    notificationLog.push(entry);
    lastSentAt = Date.now();
    return { ok: true, notification: entry };
  },
  sendNotifications(paperId, refereeEmails) {
    const now = Date.now();
    const failures = [];
    refereeEmails.forEach((email) => {
      if (failureMode) {
        failures.push(email);
        notificationLog.push(createNotificationLogEntry({
          paperId,
          refereeEmail: email,
          status: 'failed',
          errorMessage: 'send_failed',
          attemptedAt: new Date(now).toISOString(),
        }));
        return;
      }
      notificationLog.push(createNotificationLogEntry({
        paperId,
        refereeEmail: email,
        status: 'sent',
        attemptedAt: new Date(now).toISOString(),
      }));
    });

    if (failures.length === 0) {
      return { ok: true, failures: [] };
    }

    const retryTime = new Date(now + 5 * 60 * 1000).toISOString();
    const remainingFailures = [];
    failures.forEach((email) => {
      if (retryFailureMode) {
        remainingFailures.push(email);
        notificationLog.push(createNotificationLogEntry({
          paperId,
          refereeEmail: email,
          status: 'failed',
          errorMessage: 'retry_failed',
          attemptedAt: retryTime,
        }));
        return;
      }
      notificationLog.push(createNotificationLogEntry({
        paperId,
        refereeEmail: email,
        status: 'sent',
        attemptedAt: retryTime,
      }));
    });

    return { ok: remainingFailures.length === 0, failures: remainingFailures };
  },
  getReviewNotifications() {
    return notificationLog.filter((entry) => entry.reviewId);
  },
  getReviewNotificationsByEditor(editorId) {
    return notificationLog.filter((entry) => entry.reviewId && entry.editorId === editorId);
  },
};
