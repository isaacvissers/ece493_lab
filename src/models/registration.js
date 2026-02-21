function generateRegistrationId() {
  return `reg_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export function createRegistration({
  id = null,
  userId = null,
  status = 'PendingPayment',
  name = '',
  affiliation = '',
  contactEmail = '',
  attendanceType = 'in_person',
  createdAt = null,
  updatedAt = null,
} = {}) {
  const timestamp = new Date().toISOString();
  return {
    id: id || generateRegistrationId(),
    userId,
    status,
    name,
    affiliation,
    contactEmail,
    attendanceType,
    createdAt: createdAt || timestamp,
    updatedAt: updatedAt || timestamp,
  };
}
