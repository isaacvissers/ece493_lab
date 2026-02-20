function createElement(tag, className) {
  const element = document.createElement(tag);
  /* istanbul ignore else -- className is always provided by this view */
  if (className) {
    element.className = className;
  }
  return element;
}

export function createDecisionQueueView() {
  const container = createElement('section', 'card');
  const title = createElement('h1');
  title.textContent = 'Decision queue';

  const banner = createElement('div', 'status');
  banner.id = 'decision-queue-banner';
  banner.setAttribute('aria-live', 'polite');
  banner.tabIndex = -1;

  const list = createElement('ul', 'list');
  list.id = 'decision-queue-list';

  container.append(title, banner, list);

  function setStatus(message, isError) {
    banner.textContent = message || '';
    banner.className = isError ? 'status error' : 'status';
    if (isError) {
      banner.focus();
    }
  }

  function clearList() {
    list.textContent = '';
  }

  function setPapers(queueItems = []) {
    clearList();
    const items = Array.isArray(queueItems) ? queueItems : [];
    if (!items.length) {
      const empty = document.createElement('li');
      empty.textContent = 'No eligible papers available.';
      list.appendChild(empty);
      return;
    }
    items.forEach(({ paper, reviewCount }) => {
      const item = document.createElement('li');
      item.className = 'decision-queue-item';
      const titleText = paper && paper.title ? paper.title : (paper && paper.id ? paper.id : 'Paper');
      item.textContent = `${titleText} (${reviewCount} reviews)`;
      list.appendChild(item);
    });
  }

  return {
    element: container,
    setStatus,
    setPapers,
  };
}
