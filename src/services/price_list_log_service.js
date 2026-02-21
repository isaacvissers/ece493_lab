import { priceListStorage } from './storage.js';
import { createPriceListLog } from '../models/price_list_log.js';

const LOG_KEY = 'cms.price_list_logs';
const RETENTION_DAYS = 90;

function loadLogs() {
  return priceListStorage.read(LOG_KEY, []);
}

function persistLogs(logs) {
  priceListStorage.write(LOG_KEY, logs);
}

export const priceListLogService = {
  log({ priceListId = null, event = 'data_quality_issue', message = null, createdAt } = {}) {
    const logs = loadLogs().slice();
    logs.push(createPriceListLog({
      priceListId,
      event,
      message,
      timestamp: createdAt,
    }));
    persistLogs(logs);
  },
  logDataQuality({ priceListId = null, message = null } = {}) {
    priceListLogService.log({ priceListId, event: 'data_quality_issue', message });
  },
  logRenderFailure({ priceListId = null, message = null } = {}) {
    priceListLogService.log({ priceListId, event: 'render_failure', message });
  },
  logTimeout({ priceListId = null, message = null } = {}) {
    priceListLogService.log({ priceListId, event: 'timeout', message });
  },
  getLogs() {
    return loadLogs().slice();
  },
  reset() {
    priceListStorage.remove(LOG_KEY);
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
