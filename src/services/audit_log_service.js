import { decisionStorage } from './storage.js';
import { createAuditLog } from '../models/audit_log.js';

const LOG_KEY = 'cms.audit_logs';
const RETENTION_DAYS = 90;

function loadLogs() {
  return decisionStorage.read(LOG_KEY, []);
}

function persistLogs(logs) {
  decisionStorage.write(LOG_KEY, logs);
}

export const auditLogService = {
  log({ eventType, relatedId, details, createdAt } = {}) {
    const logs = loadLogs().slice();
    logs.push(createAuditLog({ eventType, relatedId, details, createdAt }));
    persistLogs(logs);
  },
  logScheduleViewDenied({ conferenceId, userId } = {}) {
    auditLogService.log({
      eventType: 'schedule_view_denied',
      relatedId: conferenceId || 'schedule',
      details: { userId },
    });
  },
  logScheduleAccessDenied({ conferenceId, authorId } = {}) {
    auditLogService.log({
      eventType: 'schedule_access_denied',
      relatedId: conferenceId || 'schedule',
      details: { authorId },
    });
  },
  logScheduleRenderFailed({ conferenceId, message } = {}) {
    auditLogService.log({
      eventType: 'schedule_render_failed',
      relatedId: conferenceId || 'schedule',
      details: { message },
    });
  },
  logScheduleTimeout({ conferenceId, durationMs } = {}) {
    auditLogService.log({
      eventType: 'schedule_timeout',
      relatedId: conferenceId || 'schedule',
      details: { durationMs },
    });
  },
  logScheduleEditDenied({ conferenceId, userId } = {}) {
    auditLogService.log({
      eventType: 'schedule_edit_denied',
      relatedId: conferenceId || 'schedule',
      details: { userId },
    });
  },
  logScheduleEditFailed({ conferenceId, entryId, message } = {}) {
    auditLogService.log({
      eventType: 'schedule_edit_failed',
      relatedId: conferenceId || 'schedule',
      details: { entryId, message },
    });
  },
  logScheduleConflict({ conferenceId, entryId, conflictEntryId } = {}) {
    auditLogService.log({
      eventType: 'schedule_conflict',
      relatedId: conferenceId || 'schedule',
      details: { entryId, conflictEntryId },
    });
  },
  logScheduleConcurrency({ conferenceId, expectedVersion, actualVersion } = {}) {
    auditLogService.log({
      eventType: 'schedule_concurrency',
      relatedId: conferenceId || 'schedule',
      details: { expectedVersion, actualVersion },
    });
  },
  logScheduleNotificationFailed({ conferenceId, entryId, message } = {}) {
    auditLogService.log({
      eventType: 'schedule_notification_failed',
      relatedId: conferenceId || 'schedule',
      details: { entryId, message },
    });
  },
  getLogs() {
    return loadLogs().slice();
  },
  reset() {
    decisionStorage.remove(LOG_KEY);
  },
  pruneOlderThan(days = RETENTION_DAYS, now = Date.now()) {
    const cutoff = now - days * 24 * 60 * 60 * 1000;
    const filtered = loadLogs().filter((log) => {
      const timestamp = Date.parse(log.createdAt);
      return Number.isNaN(timestamp) ? true : timestamp >= cutoff;
    });
    persistLogs(filtered);
    return filtered;
  },
};
