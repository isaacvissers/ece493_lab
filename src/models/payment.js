function generatePaymentId() {
  return `pay_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export function createPayment({
  id = null,
  registrationId = null,
  amount = 0,
  status = 'pending',
  providerRef = null,
} = {}) {
  return {
    id: id || generatePaymentId(),
    registrationId,
    amount,
    status,
    providerRef,
  };
}
