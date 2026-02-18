import { createAuditLog } from '../models/audit-log.js';

const AUDIT_KEY = 'cms.audit_log';
let cachedLogs = null;
let failureMode = false;

function loadLogs() {
  if (cachedLogs) {
    return cachedLogs;
  }
  const raw = localStorage.getItem(AUDIT_KEY);
  cachedLogs = raw ? JSON.parse(raw) : [];
  return cachedLogs;
}

function persistLogs(logs) {
  if (failureMode) {
    throw new Error('audit_log_failure');
  }
  localStorage.setItem(AUDIT_KEY, JSON.stringify(logs));
  cachedLogs = logs;
}

export const auditLogService = {
  setFailureMode(enabled) {
    failureMode = Boolean(enabled);
  },
  reset() {
    failureMode = false;
    cachedLogs = null;
    localStorage.removeItem(AUDIT_KEY);
  },
  log({ eventType, relatedId, details } = {}) {
    const logs = loadLogs().slice();
    logs.push(createAuditLog({ eventType, relatedId, details }));
    persistLogs(logs);
  },
  getLogs() {
    return loadLogs().slice();
  },
};
