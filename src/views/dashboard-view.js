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

  container.append(title, status, message);
  return container;
}
