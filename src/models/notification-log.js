export function createNotificationLogEntry({
  paperId,
  refereeEmail,
  status,
  errorMessage = null,
  attemptedAt = null,
}) {
  return {
    paperId,
    refereeEmail,
    status,
    errorMessage,
    attemptedAt: attemptedAt || new Date().toISOString(),
  };
}
