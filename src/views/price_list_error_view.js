function createElement(tag, className) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  return element;
}

export function createPriceListErrorView() {
  const container = createElement('section', 'card');
  const title = createElement('h1');
  title.textContent = 'Price list';

  const status = createElement('div', 'status error');
  status.id = 'price-list-error';
  status.setAttribute('aria-live', 'polite');

  const helper = createElement('p', 'helper');
  helper.textContent = 'Pricing cannot be displayed right now. Please try again.';

  container.append(title, status, helper);

  function setMessage(message) {
    status.textContent = message || 'Pricing cannot be displayed right now. Please try again.';
  }

  return {
    element: container,
    setMessage,
  };
}
