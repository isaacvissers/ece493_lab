import { retryQueue } from '../../src/services/retry_queue.js';

beforeEach(() => {
  retryQueue.reset();
});

test('retry queue enqueues and retrieves due entries', () => {
  const now = Date.now();
  const entry = retryQueue.enqueue({ transaction_id: 'tx_1', nextAttemptAt: new Date(now - 1000).toISOString() });
  expect(entry).toBeTruthy();
  const due = retryQueue.getDue({ now });
  expect(due).toHaveLength(1);
});

test('retry queue handles invalid inputs', () => {
  expect(retryQueue.enqueue()).toBe(null);
  expect(retryQueue.update()).toBe(null);
  expect(retryQueue.remove()).toBe(null);
  expect(retryQueue.getDue({ now: 'bad' })).toEqual([]);
  expect(retryQueue.processDue()).toEqual({ processed: 0, removed: 0, updated: 0 });
  expect(retryQueue.processDue({ now: 'bad', handler: () => ({ ok: true }) }))
    .toEqual({ processed: 0, removed: 0, updated: 0 });
});

test('retry queue throws on failure mode', () => {
  retryQueue.setFailureMode(true);
  expect(() => retryQueue.enqueue({ transaction_id: 'tx_fail' })).toThrow();
});

test('retry queue processes due entries', () => {
  const now = Date.now();
  retryQueue.enqueue({ transaction_id: 'tx_proc', nextAttemptAt: new Date(now - 1000).toISOString() });
  const successResult = retryQueue.processDue({
    now,
    handler: () => ({ ok: true }),
  });
  expect(successResult.removed).toBe(1);
  retryQueue.enqueue({ transaction_id: 'tx_retry', nextAttemptAt: new Date(now - 1000).toISOString() });
  const failResult = retryQueue.processDue({
    now,
    handler: () => ({ ok: false }),
  });
  expect(failResult.updated).toBe(1);
});

test('retry queue updates and removes entries', () => {
  const entry = retryQueue.enqueue({ transaction_id: 'tx_update' });
  const updated = retryQueue.update({ ...entry, attempt: entry.attempt + 1 });
  expect(updated.attempt).toBe(entry.attempt + 1);
  const removed = retryQueue.remove(entry.id);
  expect(removed).toBe(entry.id);
  expect(retryQueue.getAll()).toHaveLength(0);
});

test('retry queue returns empty when no due entries', () => {
  const result = retryQueue.processDue({ handler: () => ({ ok: true }) });
  expect(result.processed).toBe(0);
});

test('retry queue uses default getDue args', () => {
  retryQueue.enqueue({ transaction_id: 'tx_future', nextAttemptAt: new Date(Date.now() + 60000).toISOString() });
  expect(retryQueue.getDue()).toEqual([]);
});
