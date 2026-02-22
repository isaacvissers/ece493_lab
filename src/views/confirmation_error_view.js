function createElement(tag, className) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  return element;
}

const DEFAULT_MESSAGE = 'Confirmation is pending. Please check back later.';

export function createConfirmationErrorView() {
  const container = createElement('section', 'card');
  const title = createElement('h1');
  title.textContent = 'Confirmation status';

  const status = createElement('div', 'status error');
  status.id = 'confirmation-error-message';
  status.setAttribute('aria-live', 'polite');

  const helper = createElement('p', 'helper');
  helper.textContent = 'Payment is recorded. Your confirmation will be available on the next visit.';

  container.append(title, status, helper);

  function setMessage(message) {
    status.textContent = message || DEFAULT_MESSAGE;
  }

  return {
    element: container,
    setMessage,
  };
}
