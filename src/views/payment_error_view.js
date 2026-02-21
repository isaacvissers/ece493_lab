function createElement(tag, className) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  return element;
}

export function createPaymentErrorView() {
  const container = createElement('section', 'card');
  const title = createElement('h1');
  title.textContent = 'Payment error';

  const status = createElement('div', 'status error');
  status.id = 'payment-error-message';
  status.setAttribute('aria-live', 'polite');

  const helper = createElement('p', 'helper');
  helper.textContent = 'Payment could not be processed. Please try again.';

  container.append(title, status, helper);

  function setMessage(message) {
    status.textContent = message || 'Payment could not be processed. Please try again.';
  }

  return {
    element: container,
    setMessage,
  };
}
