import { auditLogger as defaultAuditLogger } from './audit_logger.js';
import { AUDIT_OUTCOMES } from './payment_constants.js';

let failureMode = false;
let lastPayload = null;

export const downstreamTrigger = {
  setFailureMode(enabled) {
    failureMode = Boolean(enabled);
  },
  reset() {
    failureMode = false;
    lastPayload = null;
  },
  dispatch({ payload, auditLogger = defaultAuditLogger } = {}) {
    lastPayload = payload || null;
    if (!payload) {
      return { ok: false, reason: 'missing_payload' };
    }
    if (failureMode) {
      auditLogger.logEvent({
        event_type: 'downstream_trigger_failed',
        transaction_id: payload.transaction_id || null,
        order_id: payload.order_id || null,
        outcome: AUDIT_OUTCOMES.failure,
        details: 'trigger_failed',
      });
      return { ok: false, reason: 'trigger_failed' };
    }
    return { ok: true };
  },
  getLastPayload() {
    return lastPayload;
  },
};
