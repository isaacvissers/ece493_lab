export const PAYMENT_CONFIRMATION_KEYS = {
  confirmations: 'cms.payment_confirmations',
  orders: 'cms.registration_orders',
  auditLogs: 'cms.payment_audit_logs',
  auditFallback: 'cms.payment_audit_fallback',
  idempotency: 'cms.payment_idempotency',
  unmatched: 'cms.unmatched_confirmations',
  retryQueue: 'cms.payment_status_retry_queue',
};

export const CONFIRMATION_CHANNELS = {
  redirect: 'redirect',
  webhook: 'webhook',
};

export const REGISTRATION_STATUS = {
  paidConfirmed: 'paid_confirmed',
};

export const AUDIT_OUTCOMES = {
  success: 'success',
  failure: 'failure',
};

export const CONFIRMATION_RESULTS = {
  stored: 'stored',
  duplicate: 'duplicate',
  rejected: 'rejected',
};

export const DEFAULT_HMAC_HEADER = 'X-Signature';
