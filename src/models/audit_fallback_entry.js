export function createAuditFallbackEntry({
  event_type = null,
  transaction_id = null,
  order_id = null,
  timestamp = null,
  details = null,
} = {}) {
  const now = new Date().toISOString();
  return {
    event_type,
    transaction_id,
    order_id,
    timestamp: timestamp || now,
    details,
  };
}
