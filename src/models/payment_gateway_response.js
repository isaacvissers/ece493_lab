export function createPaymentGatewayResponse({
  paymentId = null,
  result = 'approved',
  reason = null,
  receivedAt = null,
  nextAction = null,
} = {}) {
  return {
    paymentId,
    result,
    reason,
    receivedAt: receivedAt || new Date().toISOString(),
    nextAction,
  };
}

export function isAuthRequired(response) {
  return Boolean(response && response.result === 'requires_authentication');
}
