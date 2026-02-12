function createElement(tag, className) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  return element;
}

export function createRegistrationView() {
  const container = createElement('section', 'card');
  const title = createElement('h1');
  title.textContent = 'Create your account';

  const helper = createElement('p', 'helper');
  helper.textContent = 'Register to access the CMS dashboard.';

  const form = document.createElement('form');
  form.noValidate = true;

  const emailRow = createElement('div', 'form-row');
  const emailLabel = createElement('label');
  emailLabel.setAttribute('for', 'email');
  emailLabel.textContent = 'Email';
  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.id = 'email';
  emailInput.name = 'email';
  emailInput.autocomplete = 'email';
  const emailError = createElement('div', 'error');
  emailError.id = 'email-error';
  emailInput.setAttribute('aria-describedby', 'email-error');
  emailRow.append(emailLabel, emailInput, emailError);

  const passwordRow = createElement('div', 'form-row');
  const passwordLabel = createElement('label');
  passwordLabel.setAttribute('for', 'password');
  passwordLabel.textContent = 'Password';
  const passwordInput = document.createElement('input');
  passwordInput.type = 'password';
  passwordInput.id = 'password';
  passwordInput.name = 'password';
  passwordInput.autocomplete = 'new-password';
  const passwordError = createElement('div', 'error');
  passwordError.id = 'password-error';
  passwordInput.setAttribute('aria-describedby', 'password-error');
  passwordRow.append(passwordLabel, passwordInput, passwordError);

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.className = 'button';
  submitButton.textContent = 'Create account';

  const status = createElement('div', 'status');
  status.setAttribute('aria-live', 'polite');

  const redirectLink = document.createElement('a');
  redirectLink.href = '#login';
  redirectLink.className = 'helper';
  redirectLink.textContent = 'Go to login';
  redirectLink.style.display = 'none';

  form.append(emailRow, passwordRow, submitButton, status, redirectLink);
  container.append(title, helper, form);

  function clearErrors() {
    emailError.textContent = '';
    passwordError.textContent = '';
    status.textContent = '';
    status.className = 'status';
    redirectLink.style.display = 'none';
  }

  function setFieldError(field, message, recovery) {
    const target = field === 'password' ? passwordError : emailError;
    target.textContent = `${message} ${recovery}`.trim();
  }

  function setStatus(message, isSuccess) {
    status.textContent = message;
    status.className = isSuccess ? 'status success' : 'status';
  }

  function showRedirectError(message) {
    status.textContent = message;
    status.className = 'status error';
    redirectLink.style.display = 'inline-block';
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
    setStatus,
    setFieldError,
    clearErrors,
    focusField,
    showRedirectError,
    onSubmit(handler) {
      form.addEventListener('submit', handler);
    },
  };
}
