import { createStorageAdapter } from './storage_adapter.js';
import { PAYMENT_CONFIRMATION_KEYS } from './payment_constants.js';

const adapter = createStorageAdapter();
let failureMode = false;

function load() {
  return adapter.read(PAYMENT_CONFIRMATION_KEYS.retryQueue, []);
}

function persist(value) {
  if (failureMode) {
    throw new Error('storage_failure');
  }
  adapter.write(PAYMENT_CONFIRMATION_KEYS.retryQueue, value);
}

function generateId() {
  return `retry_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

function saveById(list, entry) {
  const next = list.slice();
  const index = next.findIndex((item) => item && item.id === entry.id);
  if (index === -1) {
    next.push(entry);
  } else {
    next[index] = entry;
  }
  return next;
}

function computeNextAttempt(attempt, nowValue) {
  const backoffMinutes = [1, 5, 15];
  const index = Math.min(Math.max(attempt - 1, 0), backoffMinutes.length - 1);
  return new Date(nowValue + backoffMinutes[index] * 60 * 1000).toISOString();
}

export const retryQueue = {
  setFailureMode(enabled) {
    failureMode = Boolean(enabled);
  },
  reset() {
    failureMode = false;
    adapter.remove(PAYMENT_CONFIRMATION_KEYS.retryQueue);
  },
  enqueue({
    id = null,
    transaction_id,
    order_id = null,
    attempt = 1,
    nextAttemptAt = new Date().toISOString(),
    createdAt = new Date().toISOString(),
  } = {}) {
    if (!transaction_id) {
      return null;
    }
    const entry = {
      id: id || generateId(),
      transaction_id,
      order_id,
      attempt,
      nextAttemptAt,
      createdAt,
    };
    const next = saveById(load(), entry);
    persist(next);
    return entry;
  },
  update(entry) {
    if (!entry || !entry.id) {
      return null;
    }
    const next = saveById(load(), entry);
    persist(next);
    return entry;
  },
  remove(id) {
    if (!id) {
      return null;
    }
    const next = load().filter((entry) => entry.id !== id);
    persist(next);
    return id;
  },
  getAll() {
    return load().slice();
  },
  getDue({ now = new Date().toISOString() } = {}) {
    const nowValue = typeof now === 'number' ? now : Date.parse(now);
    if (Number.isNaN(nowValue)) {
      return [];
    }
    return load().filter((entry) => entry && Date.parse(entry.nextAttemptAt) <= nowValue);
  },
  processDue({ now = new Date().toISOString(), handler } = {}) {
    if (typeof handler !== 'function') {
      return { processed: 0, removed: 0, updated: 0 };
    }
    const nowValue = typeof now === 'number' ? now : Date.parse(now);
    if (Number.isNaN(nowValue)) {
      return { processed: 0, removed: 0, updated: 0 };
    }
    const due = retryQueue.getDue({ now: nowValue });
    let list = load();
    let removed = 0;
    let updated = 0;
    due.forEach((entry) => {
      const result = handler(entry);
      if (result && result.ok) {
        list = list.filter((item) => item && item.id !== entry.id);
        removed += 1;
      } else {
        const nextEntry = {
          ...entry,
          attempt: entry.attempt + 1,
          nextAttemptAt: computeNextAttempt(entry.attempt + 1, nowValue),
        };
        list = saveById(list, nextEntry);
        updated += 1;
      }
    });
    if (due.length) {
      persist(list);
    }
    return { processed: due.length, removed, updated };
  },
};
