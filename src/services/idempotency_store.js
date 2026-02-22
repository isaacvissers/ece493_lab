import { createStorageAdapter } from './storage_adapter.js';
import { PAYMENT_CONFIRMATION_KEYS } from './payment_constants.js';

const adapter = createStorageAdapter();
let failureMode = false;

function load() {
  return adapter.read(PAYMENT_CONFIRMATION_KEYS.idempotency, []);
}

function persist(value) {
  if (failureMode) {
    throw new Error('storage_failure');
  }
  adapter.write(PAYMENT_CONFIRMATION_KEYS.idempotency, value);
}

function saveById(list, entry) {
  const next = list.slice();
  const index = next.findIndex((item) => item && item.transaction_id === entry.transaction_id);
  if (index === -1) {
    next.push(entry);
  } else {
    next[index] = entry;
  }
  return next;
}

export const idempotencyStore = {
  setFailureMode(enabled) {
    failureMode = Boolean(enabled);
  },
  reset() {
    failureMode = false;
    adapter.remove(PAYMENT_CONFIRMATION_KEYS.idempotency);
  },
  has(transactionId) {
    return load().some((entry) => entry && entry.transaction_id === transactionId);
  },
  get(transactionId) {
    return load().find((entry) => entry && entry.transaction_id === transactionId) || null;
  },
  record({ transaction_id, result = 'stored', recordedAt = new Date().toISOString() } = {}) {
    if (!transaction_id) {
      return null;
    }
    const entry = { transaction_id, result, recordedAt };
    const next = saveById(load(), entry);
    persist(next);
    return entry;
  },
  getAll() {
    return load().slice();
  },
};
