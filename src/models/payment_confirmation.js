function generateConfirmationId() {
  return `pc_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export function createPaymentConfirmation({
  id = null,
  transaction_id = null,
  order_id = null,
  payment_intent_id = null,
  amount = 0,
  currency = 'USD',
  timestamp = null,
  attendee_ref = null,
  status = 'confirmed',
  source_channel = 'redirect',
} = {}) {
  const now = new Date().toISOString();
  return {
    id: id || transaction_id || generateConfirmationId(),
    transaction_id,
    order_id,
    payment_intent_id,
    amount,
    currency,
    timestamp: timestamp || now,
    attendee_ref,
    status,
    source_channel,
  };
}
