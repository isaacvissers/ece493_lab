function generateConfirmationId() {
  return `conf_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export function createConfirmationRecord({
  id = null,
  registrationId = null,
  receiptId = null,
  status = 'pending',
  createdAt = null,
  updatedAt = null,
} = {}) {
  const timestamp = new Date().toISOString();
  return {
    id: id || generateConfirmationId(),
    registrationId,
    receiptId,
    status,
    createdAt: createdAt || timestamp,
    updatedAt: updatedAt || timestamp,
  };
}
