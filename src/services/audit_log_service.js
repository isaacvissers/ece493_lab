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
