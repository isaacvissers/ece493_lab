import { createStorageAdapter } from './storage_adapter.js';
import { PAYMENT_CONFIRMATION_KEYS, AUDIT_OUTCOMES } from './payment_constants.js';

const adapter = createStorageAdapter();
let failureMode = false;
let fallbackFailureMode = false;

function load(key) {
  return adapter.read(key, []);
}

function persist(key, value, fail) {
  if (fail) {
    throw new Error('storage_failure');
  }
  adapter.write(key, value);
}

function buildEntry({
  event_type,
  transaction_id,
  order_id = null,
  outcome = AUDIT_OUTCOMES.success,
  details = null,
  timestamp = new Date().toISOString(),
} = {}) {
  return {
    event_type,
    transaction_id,
    order_id,
    outcome,
    details,
    timestamp,
  };
}

export const auditLogger = {
  setFailureMode({ primary = false, fallback = false } = {}) {
    failureMode = Boolean(primary);
    fallbackFailureMode = Boolean(fallback);
  },
  reset() {
    failureMode = false;
    fallbackFailureMode = false;
    adapter.remove(PAYMENT_CONFIRMATION_KEYS.auditLogs);
    adapter.remove(PAYMENT_CONFIRMATION_KEYS.auditFallback);
  },
  logEvent(payload) {
    const entry = buildEntry(payload);
    try {
      const next = load(PAYMENT_CONFIRMATION_KEYS.auditLogs).concat(entry);
      persist(PAYMENT_CONFIRMATION_KEYS.auditLogs, next, failureMode);
      return { ok: true, entry };
    } catch (error) {
      try {
        const fallbackResult = this.logFallback({
          event_type: entry.event_type,
          transaction_id: entry.transaction_id,
          order_id: entry.order_id,
          details: entry.details,
          timestamp: entry.timestamp,
        });
        return { ok: false, entry, fallback: fallbackResult.ok };
      } catch (fallbackError) {
        return { ok: false, entry, fallback: false };
      }
    }
  },
  logFallback({ event_type, transaction_id, order_id = null, details = null, timestamp = new Date().toISOString() } = {}) {
    const entry = {
      event_type,
      transaction_id,
      order_id,
      details,
      timestamp,
    };
    const next = load(PAYMENT_CONFIRMATION_KEYS.auditFallback).concat(entry);
    persist(PAYMENT_CONFIRMATION_KEYS.auditFallback, next, fallbackFailureMode);
    return { ok: true, entry };
  },
  getLogs() {
    return load(PAYMENT_CONFIRMATION_KEYS.auditLogs).slice();
  },
  getFallbackLogs() {
    return load(PAYMENT_CONFIRMATION_KEYS.auditFallback).slice();
  },
};
