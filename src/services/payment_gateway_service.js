import { createPaymentGatewayResponse } from '../models/payment_gateway_response.js';

let nextResult = null;
let nextCaptureResult = null;
const authResults = new Map();

function consumeNextResult() {
  const result = nextResult || { result: 'approved', reason: null };
  nextResult = null;
  return result;
}

function consumeNextCaptureResult() {
  const result = nextCaptureResult || { result: 'approved', reason: null };
  nextCaptureResult = null;
  return result;
}

export const paymentGatewayService = {
  setNextResult(result, reason = null) {
    nextResult = { result, reason };
  },
  setNextCaptureResult(result, reason = null) {
    nextCaptureResult = { result, reason };
  },
  setAuthOutcome(paymentId, success = true) {
    authResults.set(paymentId, success ? 'approved' : 'declined');
  },
  authorize({ paymentId } = {}) {
    const next = consumeNextResult();
    const nextAction = next.result === 'requires_authentication' ? '3ds' : null;
    return createPaymentGatewayResponse({
      paymentId,
      result: next.result,
      reason: next.reason,
      nextAction,
    });
  },
  capture({ paymentId } = {}) {
    const next = consumeNextCaptureResult();
    return createPaymentGatewayResponse({
      paymentId,
      result: next.result,
      reason: next.reason,
    });
  },
  completeAuthentication({ paymentId, success = true } = {}) {
    const stored = authResults.has(paymentId) ? authResults.get(paymentId) : null;
    const result = stored || (success ? 'approved' : 'declined');
    authResults.delete(paymentId);
    return createPaymentGatewayResponse({
      paymentId,
      result,
      reason: result === 'declined' ? 'authentication_failed' : null,
    });
  },
  reset() {
    nextResult = null;
    nextCaptureResult = null;
    authResults.clear();
  },
};
