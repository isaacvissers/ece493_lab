import { reconciliationQueue } from '../../src/services/reconciliation_queue.js';

beforeEach(() => {
  reconciliationQueue.reset();
});

test('reconciliation queue stores unmatched confirmations', () => {
  const entry = reconciliationQueue.addUnmatched({
    transaction_id: 'tx_1',
    amount: 10,
    currency: 'USD',
    timestamp: '2026-02-20T00:00:00.000Z',
    attendee_ref: 'att_1',
    source_channel: 'redirect',
  });
  expect(entry).toBeTruthy();
  expect(reconciliationQueue.getAll()).toHaveLength(1);
  expect(reconciliationQueue.getByTransactionId('tx_1').transaction_id).toBe('tx_1');
});

test('reconciliation queue ignores empty transaction id', () => {
  expect(reconciliationQueue.addUnmatched()).toBe(null);
  expect(reconciliationQueue.getByTransactionId('missing')).toBe(null);
});

test('reconciliation queue throws on failure mode', () => {
  reconciliationQueue.setFailureMode(true);
  expect(() => reconciliationQueue.addUnmatched({ transaction_id: 'tx_fail' })).toThrow();
});
