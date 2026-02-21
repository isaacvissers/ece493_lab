function createElement(tag, className) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  return element;
}

function setError(element, message) {
  if (!element) {
    return;
  }
  element.textContent = message || '';
}

export function createRegistrationView() {
  const container = createElement('section', 'card');
  const title = createElement('h1');
  title.textContent = 'Conference registration';

  const windowInfo = createElement('p', 'helper');
  windowInfo.id = 'registration-window';

  const feeInfo = createElement('p', 'helper');
  feeInfo.id = 'registration-fee';

  const status = createElement('div', 'status');
  status.id = 'registration-status';
  status.setAttribute('aria-live', 'polite');

  const form = document.createElement('form');
  form.id = 'registration-form';

  const nameRow = createElement('div', 'form-row');
  const nameLabel = document.createElement('label');
  nameLabel.setAttribute('for', 'registration-name');
  nameLabel.textContent = 'Full name';
  const nameInput = document.createElement('input');
  nameInput.id = 'registration-name';
  nameInput.name = 'name';
  nameInput.type = 'text';
  const nameError = createElement('div', 'field-error');
  nameError.id = 'registration-name-error';
  nameRow.append(nameLabel, nameInput, nameError);

  const affiliationRow = createElement('div', 'form-row');
  const affiliationLabel = document.createElement('label');
  affiliationLabel.setAttribute('for', 'registration-affiliation');
  affiliationLabel.textContent = 'Affiliation';
  const affiliationInput = document.createElement('input');
  affiliationInput.id = 'registration-affiliation';
  affiliationInput.name = 'affiliation';
  affiliationInput.type = 'text';
  const affiliationError = createElement('div', 'field-error');
  affiliationError.id = 'registration-affiliation-error';
  affiliationRow.append(affiliationLabel, affiliationInput, affiliationError);

  const emailRow = createElement('div', 'form-row');
  const emailLabel = document.createElement('label');
  emailLabel.setAttribute('for', 'registration-email');
  emailLabel.textContent = 'Contact email';
  const emailInput = document.createElement('input');
  emailInput.id = 'registration-email';
  emailInput.name = 'contactEmail';
  emailInput.type = 'email';
  const emailError = createElement('div', 'field-error');
  emailError.id = 'registration-email-error';
  emailRow.append(emailLabel, emailInput, emailError);

  const attendanceRow = createElement('div', 'form-row');
  const attendanceLabel = document.createElement('label');
  attendanceLabel.setAttribute('for', 'registration-attendance');
  attendanceLabel.textContent = 'Attendance type';
  const attendanceSelect = document.createElement('select');
  attendanceSelect.id = 'registration-attendance';
  attendanceSelect.name = 'attendanceType';
  const optionInPerson = document.createElement('option');
  optionInPerson.value = 'in_person';
  optionInPerson.textContent = 'In-person';
  const optionVirtual = document.createElement('option');
  optionVirtual.value = 'virtual';
  optionVirtual.textContent = 'Virtual';
  attendanceSelect.append(optionInPerson, optionVirtual);
  const attendanceError = createElement('div', 'field-error');
  attendanceError.id = 'registration-attendance-error';
  attendanceRow.append(attendanceLabel, attendanceSelect, attendanceError);

  const actions = createElement('div', 'form-row');
  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.className = 'button';
  submitButton.id = 'registration-submit';
  submitButton.textContent = 'Register';
  actions.append(submitButton);

  form.append(nameRow, affiliationRow, emailRow, attendanceRow, actions);

  const receiptSlot = createElement('div', 'receipt-slot');
  receiptSlot.id = 'registration-receipt-slot';
  receiptSlot.hidden = true;

  container.append(title, windowInfo, feeInfo, status, form, receiptSlot);

  function setStatus(message, isError = false) {
    status.textContent = message || '';
    status.className = isError ? 'status error' : 'status';
  }

  function setFieldError(field, message) {
    const map = {
      name: nameError,
      affiliation: affiliationError,
      contactEmail: emailError,
      attendanceType: attendanceError,
    };
    setError(map[field], message);
  }

  function clearErrors() {
    setStatus('', false);
    setError(nameError, '');
    setError(affiliationError, '');
    setError(emailError, '');
    setError(attendanceError, '');
  }

  function setWindow({ startAt, endAt, isOpen } = {}) {
    if (startAt && endAt) {
      windowInfo.textContent = `Registration window: ${startAt} to ${endAt}.`;
    } else {
      windowInfo.textContent = 'Registration window not set.';
    }
    if (isOpen === false) {
      setStatus('Registration closed.', true);
    }
  }

  function setFee(amount) {
    if (!Number.isFinite(amount)) {
      feeInfo.textContent = 'Registration fee unavailable.';
      return;
    }
    feeInfo.textContent = amount === 0 ? 'Registration fee: Free' : `Registration fee: $${amount}`;
  }

  function setClosed({ startAt, endAt } = {}) {
    setWindow({ startAt, endAt, isOpen: false });
    submitButton.disabled = true;
  }

  function setReceiptView(view) {
    receiptSlot.innerHTML = '';
    if (view && view.element) {
      receiptSlot.appendChild(view.element);
      receiptSlot.hidden = false;
    } else {
      receiptSlot.hidden = true;
    }
  }

  function setFormEnabled(enabled) {
    submitButton.disabled = !enabled;
  }

  return {
    element: container,
    setStatus,
    setFieldError,
    clearErrors,
    setWindow,
    setFee,
    setClosed,
    setReceiptView,
    setFormEnabled,
    getValues() {
      return {
        name: nameInput.value,
        affiliation: affiliationInput.value,
        contactEmail: emailInput.value,
        attendanceType: attendanceSelect.value,
      };
    },
    setValues(values = {}) {
      nameInput.value = values.name || '';
      affiliationInput.value = values.affiliation || '';
      emailInput.value = values.contactEmail || '';
      attendanceSelect.value = values.attendanceType || 'in_person';
    },
    onSubmit(handler) {
      form.addEventListener('submit', handler);
    },
  };
}
