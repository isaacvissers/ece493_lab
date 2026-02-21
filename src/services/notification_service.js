import { decisionStorage, scheduleStorage, registrationStorage } from './storage.js';
import { notificationPrefs } from './notification_prefs.js';
import { createNotification } from '../models/notification.js';
import { createNotificationLog } from '../models/notification_log.js';

const NOTIFICATION_KEY = 'cms.notifications';
const SCHEDULE_NOTIFICATION_KEY = 'cms.schedule_notifications';
const REGISTRATION_NOTIFICATION_KEY = 'cms.registration_notifications';

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

function loadRegistrationNotifications() {
  return registrationStorage.read(REGISTRATION_NOTIFICATION_KEY, []);
}

function persistRegistrationNotifications(entries) {
  registrationStorage.write(REGISTRATION_NOTIFICATION_KEY, entries);
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
    registrationStorage.remove(REGISTRATION_NOTIFICATION_KEY);
  },
  getNotifications() {
    return loadNotifications().slice();
  },
  getScheduleNotifications() {
    return loadScheduleNotifications().slice();
  },
  getRegistrationNotifications() {
    return loadRegistrationNotifications().slice();
  },
  sendRegistrationConfirmation({ registration, channels = ['email', 'in_app'] } = {}) {
    if (!registration) {
      return { ok: false, reason: 'missing_registration' };
    }
    const entries = loadRegistrationNotifications().slice();
    const results = [];
    let failed = false;
    channels.forEach((channel) => {
      const normalized = channel === 'in_app' ? 'in_app' : 'email';
      const shouldFail = normalized === 'email' ? failureMode.email : failureMode.inApp;
      entries.push(createNotification({
        registrationId: registration.id,
        recipientId: registration.userId,
        channel: normalized,
        status: shouldFail ? 'failed' : 'sent',
        reason: shouldFail ? `${normalized}_failure` : 'registration_confirmation',
      }));
      results.push({ channel: normalized, status: shouldFail ? 'failed' : 'sent' });
      if (shouldFail) {
        failed = true;
      }
    });
    persistRegistrationNotifications(entries);
    return { ok: !failed, results, reason: failed ? 'notification_failed' : null };
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
  sendFinalScheduleNotifications({ schedule, papers = [], auditLogService } = {}) {
    if (!schedule || schedule.status !== 'published') {
      return { ok: false, reason: 'schedule_not_published' };
    }
    const results = [];
    let failed = false;

    const accepted = Array.isArray(papers) ? papers : [];
    accepted.forEach((paper) => {
      const paperId = paper.paperId || paper.id;
      const authorIds = Array.isArray(paper.authorIds) ? paper.authorIds : [];
      authorIds.forEach((authorId) => {
        const email = paper.authorEmailMap && paper.authorEmailMap[authorId]
          ? paper.authorEmailMap[authorId]
          : paper.email;
        const emailValid = isValidEmail(email);

        if (!emailValid || failureMode.email) {
          pushNotification(createNotification({
            paperId,
            recipientId: authorId,
            channel: 'email',
            status: 'failed',
            reason: !emailValid ? 'invalid_email' : 'email_failure',
          }));
          results.push({ paperId, authorId, channel: 'email', status: 'failed' });
          failed = true;
          if (auditLogService) {
            auditLogService.log({
              eventType: 'schedule_notification_failed',
              relatedId: schedule.scheduleId || schedule.conferenceId || 'schedule',
              details: {
                paperId,
                authorId,
                channel: 'email',
                reason: !emailValid ? 'invalid_email' : 'email_failure',
              },
            });
          }
        } else {
          pushNotification(createNotification({
            paperId,
            recipientId: authorId,
            channel: 'email',
            status: 'sent',
            reason: 'schedule_delivery',
          }));
          results.push({ paperId, authorId, channel: 'email', status: 'sent' });
        }

        if (failureMode.inApp) {
          pushNotification(createNotification({
            paperId,
            recipientId: authorId,
            channel: 'in_app',
            status: 'failed',
            reason: 'in_app_failure',
          }));
          results.push({ paperId, authorId, channel: 'in_app', status: 'failed' });
          failed = true;
          if (auditLogService) {
            auditLogService.log({
              eventType: 'schedule_notification_failed',
              relatedId: schedule.scheduleId || schedule.conferenceId || 'schedule',
              details: {
                paperId,
                authorId,
                channel: 'in_app',
                reason: 'in_app_failure',
              },
            });
          }
        } else {
          pushNotification(createNotification({
            paperId,
            recipientId: authorId,
            channel: 'in_app',
            status: 'sent',
            reason: 'schedule_delivery',
          }));
          results.push({ paperId, authorId, channel: 'in_app', status: 'sent' });
        }
      });
    });

    return { ok: !failed, results };
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
