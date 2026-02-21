function generateRegistrationLogId() {
  return `reglog_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export function createRegistrationLog({
  id = null,
  registrationId = null,
  event = 'save_failure',
  timestamp = null,
  message = null,
} = {}) {
  return {
    id: id || generateRegistrationLogId(),
    registrationId,
    event,
    timestamp: timestamp || new Date().toISOString(),
    message,
  };
}
