import { registrationStorage } from './storage.js';
import { createRegistrationLog } from '../models/registration_log.js';

const LOG_KEY = 'cms.registration_logs';
const RETENTION_DAYS = 90;

function loadLogs() {
  return registrationStorage.read(LOG_KEY, []);
}

function persistLogs(logs) {
  registrationStorage.write(LOG_KEY, logs);
}

export const registrationLogService = {
  log({ registrationId = null, event = 'save_failure', message = null, createdAt } = {}) {
    const logs = loadLogs().slice();
    logs.push(createRegistrationLog({
      registrationId,
      event,
      message,
      timestamp: createdAt,
    }));
    persistLogs(logs);
  },
  logSaveFailure({ registrationId = null, message = null } = {}) {
    registrationLogService.log({ registrationId, event: 'save_failure', message });
  },
  logNotificationFailure({ registrationId = null, message = null } = {}) {
    registrationLogService.log({ registrationId, event: 'notification_failure', message });
  },
  getLogs() {
    return loadLogs().slice();
  },
  reset() {
    registrationStorage.remove(LOG_KEY);
  },
  pruneOlderThan(days = RETENTION_DAYS, now = Date.now()) {
    const cutoff = now - days * 24 * 60 * 60 * 1000;
    const filtered = loadLogs().filter((log) => {
      const timestamp = Date.parse(log.timestamp);
      return Number.isNaN(timestamp) ? true : timestamp >= cutoff;
    });
    persistLogs(filtered);
    return filtered;
  },
};
