function generateAuditId() {
  return `audit_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export function createReadinessAudit({
  auditId = null,
  paperId,
  result,
  count = null,
  reason = '',
  timestamp = null,
} = {}) {
  return {
    auditId: auditId || generateAuditId(),
    paperId,
    result,
    count,
    reason,
    timestamp: timestamp || new Date().toISOString(),
  };
}
