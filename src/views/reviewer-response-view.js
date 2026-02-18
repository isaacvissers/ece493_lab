function createElement(tag, className) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  return element;
}

export function createReviewerResponseView() {
  const container = createElement('section', 'card');
  const title = createElement('h1');
  title.textContent = 'Review invitation response';

  const banner = createElement('div', 'status');
  banner.id = 'response-banner';
  banner.setAttribute('aria-live', 'polite');

  const detail = createElement('p', 'helper');
  detail.id = 'response-detail';

  const actions = createElement('div');
  actions.id = 'response-actions';

  container.append(title, banner, detail, actions);

  return {
    element: container,
    setStatus(message, isError) {
      banner.textContent = message || '';
      banner.className = isError ? 'status error' : 'status';
    },
    setDetail(message) {
      detail.textContent = message || '';
    },
    setActions(links = []) {
      actions.textContent = '';
      links.forEach((link) => {
        const anchor = document.createElement('a');
        anchor.href = link.href || '#';
        anchor.textContent = link.label;
        anchor.className = link.className || 'button secondary';
        actions.appendChild(anchor);
      });
    },
  };
}
