import { downstreamTrigger } from '../../src/services/downstream_trigger.js';
import { auditLogger } from '../../src/services/audit_logger.js';

beforeEach(() => {
  downstreamTrigger.reset();
  auditLogger.reset();
});

test('downstream trigger dispatches payload', () => {
  const payload = { transaction_id: 'tx_1', order_id: 'ord_1' };
  const result = downstreamTrigger.dispatch({ payload, auditLogger });
  expect(result.ok).toBe(true);
  expect(downstreamTrigger.getLastPayload()).toEqual(payload);
});

test('downstream trigger logs failure when dispatch fails', () => {
  downstreamTrigger.setFailureMode(true);
  const payload = { transaction_id: 'tx_2', order_id: 'ord_2' };
  const result = downstreamTrigger.dispatch({ payload, auditLogger });
  expect(result.ok).toBe(false);
  expect(auditLogger.getLogs().length).toBe(1);
});

test('downstream trigger logs failure with missing ids', () => {
  downstreamTrigger.setFailureMode(true);
  const result = downstreamTrigger.dispatch({ payload: {}, auditLogger });
  expect(result.ok).toBe(false);
  const entry = auditLogger.getLogs()[0];
  expect(entry.transaction_id).toBe(null);
  expect(entry.order_id).toBe(null);
});

test('downstream trigger rejects missing payload', () => {
  const result = downstreamTrigger.dispatch();
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('missing_payload');
});
