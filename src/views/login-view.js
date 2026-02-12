function createElement(tag, className) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  return element;
}

export function createLoginView() {
  const container = createElement('section', 'card');
  const title = createElement('h1');
  title.textContent = 'Log in to CMS';

  const helper = createElement('p', 'helper');
  helper.textContent = 'Use your email and password to access the CMS.';

  const form = document.createElement('form');
  form.noValidate = true;

  const emailRow = createElement('div', 'form-row');
  const emailLabel = createElement('label');
  emailLabel.setAttribute('for', 'login-email');
  emailLabel.textContent = 'Email';
  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.id = 'login-email';
  emailInput.name = 'email';
  emailInput.autocomplete = 'email';
  const emailError = createElement('div', 'error');
  emailError.id = 'login-email-error';
  emailInput.setAttribute('aria-describedby', 'login-email-error');
  emailRow.append(emailLabel, emailInput, emailError);

  const passwordRow = createElement('div', 'form-row');
  const passwordLabel = createElement('label');
  passwordLabel.setAttribute('for', 'login-password');
  passwordLabel.textContent = 'Password';
  const passwordInput = document.createElement('input');
  passwordInput.type = 'password';
  passwordInput.id = 'login-password';
  passwordInput.name = 'password';
  passwordInput.autocomplete = 'current-password';
  const passwordError = createElement('div', 'error');
  passwordError.id = 'login-password-error';
  passwordInput.setAttribute('aria-describedby', 'login-password-error');
  passwordRow.append(passwordLabel, passwordInput, passwordError);

  const button = document.createElement('button');
  button.type = 'submit';
  button.className = 'button';
  button.textContent = 'Log in';

  const status = createElement('div', 'status');
  status.setAttribute('aria-live', 'polite');

  const registerRow = createElement('div', 'form-row');
  const registerButton = createElement('button', 'button secondary');
  registerButton.type = 'button';
  registerButton.id = 'register-button';
  registerButton.textContent = 'Create account';
  registerRow.append(registerButton);

  form.append(emailRow, passwordRow, button, status, registerRow);
  container.append(title, helper, form);

  function clearErrors() {
    emailError.textContent = '';
    passwordError.textContent = '';
    status.textContent = '';
    status.className = 'status';
  }

  function setFieldError(field, message, recovery) {
    const target = field === 'password' ? passwordError : emailError;
    target.textContent = `${message} ${recovery}`.trim();
  }

  function setStatus(message, isError) {
    status.textContent = message;
    status.className = isError ? 'status error' : 'status';
  }

  function showAccessDenied(message) {
    setStatus(message, true);
  }

  function focusField(field) {
    if (field === 'password') {
      passwordInput.focus();
    } else {
      emailInput.focus();
    }
  }

  return {
    element: container,
    getValues() {
      return {
        email: emailInput.value,
        password: passwordInput.value,
      };
    },
    clearErrors,
    setFieldError,
    setStatus,
    showAccessDenied,
    focusField,
    onSubmit(handler) {
      form.addEventListener('submit', handler);
    },
    onRegister(handler) {
      registerButton.addEventListener('click', handler);
    },
  };
}
