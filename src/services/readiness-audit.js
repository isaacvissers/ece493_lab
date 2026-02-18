import { createReadinessAudit } from '../models/readiness-audit.js';

const audits = [];

export const readinessAudit = {
  record({ paperId, result, count = null, reason = '' } = {}) {
    const entry = createReadinessAudit({
      paperId,
      result,
      count,
      reason,
    });
    audits.push(entry);
    return entry;
  },
  getEntries() {
    return audits.slice();
  },
  clear() {
    audits.length = 0;
  },
};
