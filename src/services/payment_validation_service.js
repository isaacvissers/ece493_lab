function isPresent(value) {
  return value !== null && value !== undefined && String(value).trim() !== '';
}

export const paymentValidationService = {
  validate(values = {}) {
    const errors = {};
    const requiredFields = [
      'registrationId',
      'amount',
      'currency',
      'cardholderName',
      'cardNumber',
      'expiryMonth',
      'expiryYear',
      'cvv',
      'idempotencyKey',
      'billingPostal',
    ];

    requiredFields.forEach((field) => {
      if (!isPresent(values[field])) {
        errors[field] = 'required';
      }
    });

    return {
      ok: Object.keys(errors).length === 0,
      errors,
      values,
    };
  },
};
