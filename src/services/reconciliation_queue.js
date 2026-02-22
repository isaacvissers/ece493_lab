import { createStorageAdapter } from './storage_adapter.js';
import { PAYMENT_CONFIRMATION_KEYS } from './payment_constants.js';
import { createUnmatchedPayment } from '../models/unmatched_payment.js';

const adapter = createStorageAdapter();
let failureMode = false;

function load() {
  return adapter.read(PAYMENT_CONFIRMATION_KEYS.unmatched, []);
}

function persist(value) {
  if (failureMode) {
    throw new Error('storage_failure');
  }
  adapter.write(PAYMENT_CONFIRMATION_KEYS.unmatched, value);
}

function generateId() {
  return `unmatched_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export const reconciliationQueue = {
  setFailureMode(enabled) {
    failureMode = Boolean(enabled);
  },
  reset() {
    failureMode = false;
    adapter.remove(PAYMENT_CONFIRMATION_KEYS.unmatched);
  },
  addUnmatched({
    transaction_id,
    amount,
    currency,
    timestamp,
    attendee_ref = null,
    reason = 'no_matching_order',
    source_channel = 'unknown',
  } = {}) {
    if (!transaction_id) {
      return null;
    }
    const entry = createUnmatchedPayment({
      id: generateId(),
      transaction_id,
      amount,
      currency,
      timestamp,
      attendee_ref,
      reason,
      source_channel,
    });
    const next = load().concat(entry);
    persist(next);
    return entry;
  },
  getAll() {
    return load().slice();
  },
  getByTransactionId(transactionId) {
    return load().find((entry) => entry && entry.transaction_id === transactionId) || null;
  },
};
