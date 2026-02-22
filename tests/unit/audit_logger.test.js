import { auditLogger } from '../../src/services/audit_logger.js';

beforeEach(() => {
  auditLogger.reset();
});

test('audit logger records events', () => {
  const result = auditLogger.logEvent({ event_type: 'confirmation', transaction_id: 'tx_1' });
  expect(result.ok).toBe(true);
  expect(auditLogger.getLogs()).toHaveLength(1);
});

test('audit logger supports default arguments', () => {
  auditLogger.setFailureMode();
  const result = auditLogger.logEvent();
  expect(result.ok).toBe(true);
  const fallback = auditLogger.logFallback();
  expect(fallback.ok).toBe(true);
});

test('audit logger falls back on failure', () => {
  auditLogger.setFailureMode({ primary: true, fallback: false });
  const result = auditLogger.logEvent({ event_type: 'confirmation', transaction_id: 'tx_2' });
  expect(result.ok).toBe(false);
  expect(result.fallback).toBe(true);
  expect(auditLogger.getFallbackLogs()).toHaveLength(1);
});

test('audit logger reports fallback failure', () => {
  auditLogger.setFailureMode({ primary: true, fallback: true });
  const result = auditLogger.logEvent({ event_type: 'confirmation', transaction_id: 'tx_3' });
  expect(result.ok).toBe(false);
  expect(result.fallback).toBe(false);
});
