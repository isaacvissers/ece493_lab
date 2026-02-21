function generatePaymentId() {
  return `pay_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export function createPayment({
  id = null,
  registrationId = null,
  amount = 0,
  currency = 'USD',
  status = 'pending',
  idempotencyKey = null,
  attemptedAt = null,
  capturedAt = null,
  reference = null,
  providerRef = null,
  cardLast4 = null,
  cardBrand = null,
} = {}) {
  return {
    id: id || generatePaymentId(),
    registrationId,
    amount,
    currency,
    status,
    idempotencyKey,
    attemptedAt,
    capturedAt,
    reference,
    providerRef,
    cardLast4,
    cardBrand,
  };
}
