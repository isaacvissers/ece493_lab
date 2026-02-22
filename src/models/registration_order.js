function generateOrderId() {
  return `ord_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export function createRegistrationOrder({
  order_id = null,
  payment_intent_id = null,
  attendee_ref = null,
  amount = 0,
  currency = 'USD',
  status = 'pending',
  paid_at = null,
  created_at = null,
  updated_at = null,
} = {}) {
  const now = new Date().toISOString();
  return {
    order_id: order_id || generateOrderId(),
    payment_intent_id,
    attendee_ref,
    amount,
    currency,
    status,
    paid_at,
    created_at: created_at || now,
    updated_at: updated_at || now,
  };
}
