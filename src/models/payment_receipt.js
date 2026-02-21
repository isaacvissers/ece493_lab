function generateReceiptReference() {
  return `rcpt_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export function createPaymentReceipt({
  paymentId = null,
  registrationId = null,
  amount = 0,
  currency = 'USD',
  paidAt = null,
  reference = null,
} = {}) {
  return {
    paymentId,
    registrationId,
    amount,
    currency,
    paidAt,
    reference: reference || generateReceiptReference(),
  };
}
