import { scheduleStorage } from './storage.js';
import { createPublicationLog } from '../models/publication_log.js';

const LOG_KEY = 'cms.publication_logs';
const RETENTION_DAYS = 90;

function loadLogs() {
  return scheduleStorage.read(LOG_KEY, []);
}

function persistLogs(logs) {
  scheduleStorage.write(LOG_KEY, logs);
}

export const publicationLogService = {
  log({ status = 'failure', errorMessage = null, context = 'publish', relatedId = null, createdAt } = {}) {
    const logs = loadLogs().slice();
    logs.push(createPublicationLog({
      status,
      errorMessage,
      context,
      relatedId,
      createdAt,
    }));
    persistLogs(logs);
  },
  logFailure({ context = 'publish', errorMessage = null, relatedId = null } = {}) {
    publicationLogService.log({ status: 'failure', context, errorMessage, relatedId });
  },
  logSuccess({ context = 'publish', relatedId = null } = {}) {
    publicationLogService.log({ status: 'success', context, errorMessage: null, relatedId });
  },
  getLogs() {
    return loadLogs().slice();
  },
  reset() {
    scheduleStorage.remove(LOG_KEY);
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
