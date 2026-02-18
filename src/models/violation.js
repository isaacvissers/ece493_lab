function generateViolationId() {
  return `vio_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export function createViolation({ id = null, reviewerEmail = '', rule, message } = {}) {
  return {
    violationId: id || generateViolationId(),
    reviewerEmail,
    rule,
    message,
  };
}
