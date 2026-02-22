function generateDeliveryLogId() {
  return `dlog_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export function createDeliveryLog({
  id = null,
  registrationId = null,
  channel = 'email',
  status = 'sent',
  lastAttemptAt = null,
  reason = null,
} = {}) {
  const timestamp = new Date().toISOString();
  return {
    id: id || generateDeliveryLogId(),
    registrationId,
    channel,
    status,
    lastAttemptAt: lastAttemptAt || timestamp,
    reason,
  };
}
