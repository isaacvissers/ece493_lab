function createElement(tag, className) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  return element;
}

export function createDashboardView(user) {
  const container = createElement('section', 'card');
  const title = createElement('h1');
  title.textContent = 'Dashboard';

  const status = createElement('p', 'helper');
  if (user && user.email) {
    status.textContent = `Signed in as ${user.email}.`;
  } else {
    status.textContent = 'Signed in.';
  }

  const message = createElement('div', 'status');
  message.textContent = 'Welcome to your CMS dashboard.';

  const actions = createElement('div', 'form-row');
  const changePasswordButton = document.createElement('button');
  changePasswordButton.type = 'button';
  changePasswordButton.className = 'button secondary';
  changePasswordButton.id = 'change-password-button';
  changePasswordButton.textContent = 'Change password';
  actions.append(changePasswordButton);

  container.append(title, status, message, actions);
  return {
    element: container,
    onChangePassword(handler) {
      changePasswordButton.addEventListener('click', handler);
    },
  };
}
