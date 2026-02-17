import { createNotificationLogEntry } from '../models/notification-log.js';

const notificationLog = [];
let failureMode = false;
let retryFailureMode = false;

export const notificationService = {
  setFailureMode(enabled) {
    failureMode = Boolean(enabled);
  },
  setRetryFailureMode(enabled) {
    retryFailureMode = Boolean(enabled);
  },
  clear() {
    notificationLog.length = 0;
    failureMode = false;
    retryFailureMode = false;
  },
  getLog() {
    return notificationLog.slice();
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
};
