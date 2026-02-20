function generateLogId() {
  return `log_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export function createAuditLog({
  logId = null,
  eventType,
  relatedId,
  details = {},
  createdAt = null,
} = {}) {
  return {
    logId: logId || generateLogId(),
    eventType,
    relatedId,
    details,
    createdAt: createdAt || new Date().toISOString(),
  };
}
