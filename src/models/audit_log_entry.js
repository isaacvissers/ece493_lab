export function createAuditLogEntry({
  event_type = null,
  transaction_id = null,
  order_id = null,
  timestamp = null,
  outcome = 'success',
  details = null,
} = {}) {
  const now = new Date().toISOString();
  return {
    event_type,
    transaction_id,
    order_id,
    timestamp: timestamp || now,
    outcome,
    details,
  };
}
