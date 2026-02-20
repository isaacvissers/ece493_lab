function createElement(tag, className) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  return element;
}

export function createNotificationSettingsView() {
  const container = createElement('section', 'card');
  const title = createElement('h2');
  title.textContent = 'Notification settings';

  const status = createElement('div', 'status');
  status.id = 'notification-settings-status';
  status.setAttribute('aria-live', 'polite');
  status.tabIndex = -1;

  const form = document.createElement('form');
  form.noValidate = true;

  const emailLabel = document.createElement('label');
  emailLabel.setAttribute('for', 'notify-email');
  emailLabel.textContent = 'Email notifications';

  const emailToggle = document.createElement('input');
  emailToggle.type = 'checkbox';
  emailToggle.id = 'notify-email';

  const inAppLabel = document.createElement('label');
  inAppLabel.setAttribute('for', 'notify-inapp');
  inAppLabel.textContent = 'In-app notifications';

  const inAppToggle = document.createElement('input');
  inAppToggle.type = 'checkbox';
  inAppToggle.id = 'notify-inapp';

  const saveButton = createElement('button', 'button');
  saveButton.type = 'submit';
  saveButton.textContent = 'Save preferences';

  form.append(emailLabel, emailToggle, inAppLabel, inAppToggle, saveButton);
  container.append(title, status, form);

  function setStatus(message, isError) {
    status.textContent = message || '';
    status.className = isError ? 'status error' : 'status';
    if (isError) {
      status.focus();
    }
  }

  return {
    element: container,
    setStatus,
    setPreferences({ email, inApp } = {}) {
      emailToggle.checked = Boolean(email);
      inAppToggle.checked = Boolean(inApp);
    },
    getPreferences() {
      return {
        email: emailToggle.checked,
        inApp: inAppToggle.checked,
      };
    },
    onSubmit(handler) {
      form.addEventListener('submit', handler);
    },
  };
}
