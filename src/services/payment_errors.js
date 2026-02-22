export function createError(code, message, details = null) {
  return { code, message, details };
}

export function okResult(payload = {}) {
  return { ok: true, ...payload };
}

export function failResult(reason, details = null) {
  return { ok: false, reason, details };
}

export const ERROR_CODES = {
  validation: 'validation_failed',
  signature: 'invalid_signature',
  duplicate: 'duplicate_confirmation',
  storage: 'storage_failure',
  statusUpdate: 'status_update_failure',
  audit: 'audit_failure',
};
