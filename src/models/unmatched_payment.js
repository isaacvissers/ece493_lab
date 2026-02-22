function generateUnmatchedId() {
  return `unmatched_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export function createUnmatchedPayment({
  id = null,
  transaction_id = null,
  amount = 0,
  currency = 'USD',
  timestamp = null,
  attendee_ref = null,
  reason = 'no_matching_order',
  source_channel = 'redirect',
} = {}) {
  const now = new Date().toISOString();
  return {
    id: id || generateUnmatchedId(),
    transaction_id,
    amount,
    currency,
    timestamp: timestamp || now,
    attendee_ref,
    reason,
    source_channel,
  };
}
