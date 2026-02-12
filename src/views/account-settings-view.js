function createElement(tag, className) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  return element;
}

export function createAccountSettingsView() {
  const container = createElement('section', 'card');
  const title = createElement('h1');
  title.textContent = 'Change password';

  const helper = createElement('p', 'helper');
  helper.textContent = 'Update your password to keep your account secure.';

  const form = document.createElement('form');
  form.noValidate = true;

  const currentRow = createElement('div', 'form-row');
  const currentLabel = createElement('label');
  currentLabel.setAttribute('for', 'current-password');
  currentLabel.textContent = 'Current password';
  const currentInput = document.createElement('input');
  currentInput.type = 'password';
  currentInput.id = 'current-password';
  currentInput.name = 'currentPassword';
  currentInput.autocomplete = 'current-password';
  const currentError = createElement('div', 'error');
  currentError.id = 'current-password-error';
  currentInput.setAttribute('aria-describedby', 'current-password-error');
  currentRow.append(currentLabel, currentInput, currentError);

  const newRow = createElement('div', 'form-row');
  const newLabel = createElement('label');
  newLabel.setAttribute('for', 'new-password');
  newLabel.textContent = 'New password';
  const newInput = document.createElement('input');
  newInput.type = 'password';
  newInput.id = 'new-password';
  newInput.name = 'newPassword';
  newInput.autocomplete = 'new-password';
  const newError = createElement('div', 'error');
  newError.id = 'new-password-error';
  newInput.setAttribute('aria-describedby', 'new-password-error');
  newRow.append(newLabel, newInput, newError);

  const confirmRow = createElement('div', 'form-row');
  const confirmLabel = createElement('label');
  confirmLabel.setAttribute('for', 'confirm-password');
  confirmLabel.textContent = 'Confirm new password';
  const confirmInput = document.createElement('input');
  confirmInput.type = 'password';
  confirmInput.id = 'confirm-password';
  confirmInput.name = 'confirmPassword';
  confirmInput.autocomplete = 'new-password';
  const confirmError = createElement('div', 'error');
  confirmError.id = 'confirm-password-error';
  confirmInput.setAttribute('aria-describedby', 'confirm-password-error');
  confirmRow.append(confirmLabel, confirmInput, confirmError);

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.className = 'button';
  submitButton.textContent = 'Update password';

  const status = createElement('div', 'status');
  status.setAttribute('aria-live', 'polite');

  const backRow = createElement('div', 'form-row');
  const backButton = document.createElement('button');
  backButton.type = 'button';
  backButton.className = 'button secondary';
  backButton.id = 'dashboard-button';
  backButton.textContent = 'Back to dashboard';
  backRow.append(backButton);

  form.append(currentRow, newRow, confirmRow, submitButton, status, backRow);
  container.append(title, helper, form);

  function clearErrors() {
    currentError.textContent = '';
    newError.textContent = '';
    confirmError.textContent = '';
    status.textContent = '';
    status.className = 'status';
  }

  function setFieldError(field, message, recovery) {
    let target = currentError;
    if (field === 'newPassword') {
      target = newError;
    } else if (field === 'confirmPassword') {
      target = confirmError;
    }
    target.textContent = `${message} ${recovery}`.trim();
  }

  function setStatus(message, isError) {
    status.textContent = message;
    status.className = isError ? 'status error' : 'status';
  }

  function focusField(field) {
    if (field === 'newPassword') {
      newInput.focus();
    } else if (field === 'confirmPassword') {
      confirmInput.focus();
    } else {
      currentInput.focus();
    }
  }

  return {
    element: container,
    getValues() {
      return {
        currentPassword: currentInput.value,
        newPassword: newInput.value,
        confirmPassword: confirmInput.value,
      };
    },
    clearErrors,
    setFieldError,
    setStatus,
    focusField,
    onSubmit(handler) {
      form.addEventListener('submit', handler);
    },
    onBack(handler) {
      backButton.addEventListener('click', handler);
    },
  };
}
