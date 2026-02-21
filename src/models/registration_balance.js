export function createRegistrationBalance({
  registrationId = null,
  amountDue = 0,
  amountPaid = 0,
  status = 'unpaid',
} = {}) {
  return {
    registrationId,
    amountDue,
    amountPaid,
    status,
  };
}
