function generatePublicationLogId() {
  return `pub_log_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export function createPublicationLog({
  id = null,
  status = 'failure',
  errorMessage = null,
  context = 'publish',
  relatedId = null,
  createdAt = null,
} = {}) {
  const timestamp = createdAt || new Date().toISOString();
  return {
    id: id || generatePublicationLogId(),
    timestamp,
    status,
    errorMessage,
    context,
    relatedId,
  };
}
