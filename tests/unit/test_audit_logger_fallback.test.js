import { auditLogger } from '../../src/services/audit_logger.js';

beforeEach(() => {
  auditLogger.reset();
});

test('audit logger writes fallback entries', () => {
  auditLogger.setFailureMode({ primary: true, fallback: false });
  const result = auditLogger.logEvent({ event_type: 'fallback_test', transaction_id: 'tx_fb' });
  expect(result.ok).toBe(false);
  expect(auditLogger.getFallbackLogs()).toHaveLength(1);
});
