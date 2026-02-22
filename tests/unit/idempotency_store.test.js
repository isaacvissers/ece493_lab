import { idempotencyStore } from '../../src/services/idempotency_store.js';

beforeEach(() => {
  idempotencyStore.reset();
});

test('idempotency store records and checks transactions', () => {
  expect(idempotencyStore.has('tx_1')).toBe(false);
  idempotencyStore.record({ transaction_id: 'tx_1', result: 'stored' });
  expect(idempotencyStore.has('tx_1')).toBe(true);
  expect(idempotencyStore.get('tx_1').result).toBe('stored');
  expect(idempotencyStore.getAll()).toHaveLength(1);
});

test('idempotency store ignores empty transaction id', () => {
  const entry = idempotencyStore.record({});
  expect(entry).toBe(null);
});

test('idempotency store returns null when called without args', () => {
  const entry = idempotencyStore.record();
  expect(entry).toBe(null);
});

test('idempotency store uses default recordedAt', () => {
  const entry = idempotencyStore.record({ transaction_id: 'tx_default' });
  expect(entry.recordedAt).toBeTruthy();
  expect(idempotencyStore.get('missing')).toBe(null);
});

test('idempotency store updates existing entry', () => {
  idempotencyStore.record({ transaction_id: 'tx_update', result: 'stored' });
  const updated = idempotencyStore.record({ transaction_id: 'tx_update', result: 'duplicate' });
  expect(updated.result).toBe('duplicate');
  expect(idempotencyStore.getAll()).toHaveLength(1);
});

test('idempotency store throws on failure mode', () => {
  idempotencyStore.setFailureMode(true);
  expect(() => idempotencyStore.record({ transaction_id: 'tx_fail' })).toThrow();
});
