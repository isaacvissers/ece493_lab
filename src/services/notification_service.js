import { decisionStorage, scheduleStorage } from './storage.js';
import { notificationPrefs } from './notification_prefs.js';
import { createNotification } from '../models/notification.js';
import { createNotificationLog } from '../models/notification_log.js';

const NOTIFICATION_KEY = 'cms.notifications';
const SCHEDULE_NOTIFICATION_KEY = 'cms.schedule_notifications';

let failureMode = {
  email: false,
  inApp: false,
};

function loadNotifications() {
  return decisionStorage.read(NOTIFICATION_KEY, []);
}

function persistNotifications(entries) {
  decisionStorage.write(NOTIFICATION_KEY, entries);
}

function loadScheduleNotifications() {
  return scheduleStorage.read(SCHEDULE_NOTIFICATION_KEY, []);
}

function persistScheduleNotifications(entries) {
  scheduleStorage.write(SCHEDULE_NOTIFICATION_KEY, entries);
}

function isValidEmail(email) {
  if (!email) {
    return false;
  }
  return /.+@.+\..+/.test(email);
}

function pushNotification(entry) {
  const entries = loadNotifications().slice();
  entries.push(entry);
  persistNotifications(entries);
}

export const notificationService = {
  setFailureMode({ email = false, inApp = false } = {}) {
    failureMode = {
      email: Boolean(email),
      inApp: Boolean(inApp),
    };
  },
  reset() {
    failureMode = { email: false, inApp: false };
    decisionStorage.remove(NOTIFICATION_KEY);
    scheduleStorage.remove(SCHEDULE_NOTIFICATION_KEY);
  },
  getNotifications() {
    return loadNotifications().slice();
  },
  getScheduleNotifications() {
    return loadScheduleNotifications().slice();
  },
  triggerScheduleNotifications({ schedule, entry } = {}) {
    if (!schedule || !entry) {
      return { ok: false, reason: 'missing_payload' };
    }
    const entries = loadScheduleNotifications().slice();
    if (failureMode.email || failureMode.inApp) {
      entries.push(createNotificationLog({
        scheduleId: schedule.scheduleId,
        status: 'failed',
        details: { entryId: entry.entryId || entry.itemId },
      }));
      persistScheduleNotifications(entries);
      return { ok: false, reason: 'notification_failed' };
    }
    entries.push(createNotificationLog({
      scheduleId: schedule.scheduleId,
      status: 'sent',
      details: { entryId: entry.entryId || entry.itemId },
    }));
    persistScheduleNotifications(entries);
    return { ok: true };
  },
  sendDecisionNotifications({ paper, decision, authors = [], auditLogService } = {}) {
    if (!paper || !decision) {
      return { ok: false, reason: 'missing_payload' };
    }
    const results = [];
    authors.forEach((author) => {
      const authorId = author.authorId || author.id;
      const prefs = notificationPrefs.getPreferences(authorId);
      const channels = {
        email: Boolean(prefs.email),
        inApp: Boolean(prefs.inApp),
      };

      if (!channels.email && !channels.inApp) {
        results.push({ authorId, status: 'skipped' });
        return;
      }

      const emailValid = isValidEmail(author.email);
      if (channels.email) {
        if (!emailValid) {
          if (auditLogService) {
            auditLogService.log({
              eventType: 'notification_failed',
              relatedId: decision.decisionId,
              details: { authorId, reason: 'invalid_email' },
            });
          }
        } else if (failureMode.email) {
          pushNotification(createNotification({
            paperId: paper.paperId || paper.id,
            decisionId: decision.decisionId,
            recipientId: authorId,
            channel: 'email',
            status: 'failed',
            reason: 'email_failure',
          }));
          if (auditLogService) {
            auditLogService.log({
              eventType: 'notification_failed',
              relatedId: decision.decisionId,
              details: { authorId, reason: 'email_failure' },
            });
          }
        } else {
          pushNotification(createNotification({
            paperId: paper.paperId || paper.id,
            decisionId: decision.decisionId,
            recipientId: authorId,
            channel: 'email',
            status: 'sent',
          }));
          results.push({ authorId, status: 'sent', channel: 'email' });
          return;
        }
      }

      if (channels.inApp) {
        if (failureMode.inApp) {
          pushNotification(createNotification({
            paperId: paper.paperId || paper.id,
            decisionId: decision.decisionId,
            recipientId: authorId,
            channel: 'in_app',
            status: 'failed',
            reason: 'in_app_failure',
          }));
          if (auditLogService) {
            auditLogService.log({
              eventType: 'notification_failed',
              relatedId: decision.decisionId,
              details: { authorId, reason: 'in_app_failure' },
            });
          }
        } else {
          pushNotification(createNotification({
            paperId: paper.paperId || paper.id,
            decisionId: decision.decisionId,
            recipientId: authorId,
            channel: 'in_app',
            status: 'sent',
          }));
          results.push({ authorId, status: 'sent', channel: 'in_app' });
        }
      }
    });

    return { ok: true, results };
  },
};
