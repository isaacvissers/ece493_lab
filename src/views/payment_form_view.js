function createElement(tag, className) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  return element;
}

export function createInputRow({ id, label, type = 'text', autocomplete = null } = {}) {
  const row = createElement('div', 'form-row');
  const labelNode = document.createElement('label');
  labelNode.setAttribute('for', id);
  labelNode.textContent = label;
  const input = document.createElement('input');
  input.id = id;
  input.name = id;
  input.type = type;
  if (autocomplete) {
    input.autocomplete = autocomplete;
  }
  const error = createElement('div', 'error');
  error.id = `${id}-error`;
  input.setAttribute('aria-describedby', error.id);
  row.append(labelNode, input, error);
  return { row, input, error };
}

export function createPaymentFormView() {
  const container = createElement('section', 'card');
  const title = createElement('h1');
  title.textContent = 'Credit card payment';

  const helper = createElement('p', 'helper');
  helper.textContent = 'Enter your credit card details to complete payment.';

  const form = document.createElement('form');
  form.noValidate = true;

  const cardholder = createInputRow({ id: 'cardholderName', label: 'Cardholder name', autocomplete: 'cc-name' });
  const cardNumber = createInputRow({ id: 'cardNumber', label: 'Card number', autocomplete: 'cc-number' });
  const expiryMonth = createInputRow({ id: 'expiryMonth', label: 'Expiry month', autocomplete: 'cc-exp-month' });
  const expiryYear = createInputRow({ id: 'expiryYear', label: 'Expiry year', autocomplete: 'cc-exp-year' });
  const cvv = createInputRow({ id: 'cvv', label: 'CVV', type: 'password', autocomplete: 'cc-csc' });
  const billingPostal = createInputRow({ id: 'billingPostal', label: 'Billing postal code', autocomplete: 'postal-code' });

  const status = createElement('div', 'status');
  status.id = 'payment-status-message';
  status.setAttribute('aria-live', 'polite');

  const receipt = createElement('div', 'receipt');
  receipt.hidden = true;
  const receiptTitle = createElement('h2');
  receiptTitle.textContent = 'Payment receipt';
  const receiptList = document.createElement('dl');
  receiptList.className = 'receipt-list';
  const receiptFields = {
    reference: { label: 'Reference', value: '' },
    amount: { label: 'Amount', value: '' },
    paidAt: { label: 'Paid at', value: '' },
  };
  Object.entries(receiptFields).forEach(([key, entry]) => {
    const dt = document.createElement('dt');
    dt.textContent = entry.label;
    const dd = document.createElement('dd');
    dd.id = `payment-receipt-${key}`;
    receiptList.append(dt, dd);
  });
  receipt.append(receiptTitle, receiptList);

  const actions = createElement('div', 'form-row');
  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.className = 'button';
  submitButton.textContent = 'Pay now';
  const cancelButton = document.createElement('button');
  cancelButton.type = 'button';
  cancelButton.className = 'button secondary';
  cancelButton.id = 'payment-cancel';
  cancelButton.textContent = 'Cancel';
  actions.append(submitButton, cancelButton);

  form.append(
    cardholder.row,
    cardNumber.row,
    expiryMonth.row,
    expiryYear.row,
    cvv.row,
    billingPostal.row,
    status,
    actions,
  );

  container.append(title, helper, form, receipt);

  function setStatus(message, isError = false) {
    status.textContent = message || '';
    status.className = isError ? 'status error' : 'status';
  }

  function clearErrors() {
    [cardholder, cardNumber, expiryMonth, expiryYear, cvv, billingPostal].forEach((field) => {
      field.error.textContent = '';
    });
    setStatus('', false);
  }

  function setFieldError(field, message) {
    const map = {
      cardholderName: cardholder.error,
      cardNumber: cardNumber.error,
      expiryMonth: expiryMonth.error,
      expiryYear: expiryYear.error,
      cvv: cvv.error,
      billingPostal: billingPostal.error,
    };
    if (map[field]) {
      map[field].textContent = message;
    }
  }

  function setReceipt(receiptData = {}) {
    receipt.hidden = false;
    Object.keys(receiptFields).forEach((key) => {
      const node = receipt.querySelector(`#payment-receipt-${key}`);
      if (node) {
        node.textContent = receiptData[key] || '';
      }
    });
  }

  function setFormEnabled(enabled) {
    submitButton.disabled = !enabled;
    cancelButton.disabled = !enabled;
  }

  return {
    element: container,
    getValues() {
      return {
        cardholderName: cardholder.input.value,
        cardNumber: cardNumber.input.value,
        expiryMonth: expiryMonth.input.value,
        expiryYear: expiryYear.input.value,
        cvv: cvv.input.value,
        billingPostal: billingPostal.input.value,
      };
    },
    setStatus,
    setFieldError,
    clearErrors,
    setReceipt,
    setFormEnabled,
    onSubmit(handler) {
      form.addEventListener('submit', handler);
    },
    onCancel(handler) {
      cancelButton.addEventListener('click', handler);
    },
  };
}
