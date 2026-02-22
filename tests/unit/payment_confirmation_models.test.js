import { createPaymentConfirmation } from '../../src/models/payment_confirmation.js';
import { createAuditLogEntry } from '../../src/models/audit_log_entry.js';
import { createUnmatchedPayment } from '../../src/models/unmatched_payment.js';
import { createAuditFallbackEntry } from '../../src/models/audit_fallback_entry.js';


test('payment confirmation defaults fields', () => {
  const confirmation = createPaymentConfirmation({ transaction_id: 'tx_1' });
  expect(confirmation.transaction_id).toBe('tx_1');
  expect(confirmation.timestamp).toBeTruthy();
  expect(confirmation.source_channel).toBe('redirect');
});

test('payment confirmation uses generated defaults', () => {
  const confirmation = createPaymentConfirmation();
  expect(confirmation.id).toContain('pc_');
  expect(confirmation.currency).toBe('USD');
});

test('payment confirmation preserves explicit timestamp', () => {
  const confirmation = createPaymentConfirmation({
    transaction_id: 'tx_2',
    timestamp: '2026-02-21T00:00:00.000Z',
  });
  expect(confirmation.timestamp).toBe('2026-02-21T00:00:00.000Z');
});
test('audit log entry defaults outcome', () => {
  const entry = createAuditLogEntry({ event_type: 'stored', transaction_id: 'tx_1' });
  expect(entry.outcome).toBe('success');
  expect(entry.timestamp).toBeTruthy();
});

test('audit log entry supports empty input', () => {
  const entry = createAuditLogEntry();
  expect(entry.timestamp).toBeTruthy();
});

test('unmatched payment defaults reason', () => {
  const entry = createUnmatchedPayment({ transaction_id: 'tx_2', amount: 10, currency: 'USD' });
  expect(entry.reason).toBe('no_matching_order');
  expect(entry.source_channel).toBe('redirect');
});

test('unmatched payment supports empty input', () => {
  const entry = createUnmatchedPayment();
  expect(entry.id).toContain('unmatched_');
});

test('unmatched payment preserves explicit timestamp', () => {
  const entry = createUnmatchedPayment({
    transaction_id: 'tx_3',
    timestamp: '2026-02-21T01:00:00.000Z',
  });
  expect(entry.timestamp).toBe('2026-02-21T01:00:00.000Z');
});

test('audit fallback entry preserves fields', () => {
  const entry = createAuditFallbackEntry({
    event_type: 'fallback',
    transaction_id: 'tx_3',
    order_id: 'ord_3',
    details: 'failed',
  });
  expect(entry.order_id).toBe('ord_3');
  expect(entry.timestamp).toBeTruthy();
});

test('audit fallback entry supports empty input', () => {
  const entry = createAuditFallbackEntry();
  expect(entry.timestamp).toBeTruthy();
});
