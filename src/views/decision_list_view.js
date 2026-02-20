function createElement(tag, className) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  return element;
}

export function createDecisionListView() {
  let selectHandler = null;

  const container = createElement('section', 'card');
  const title = createElement('h2');
  title.textContent = 'My Decisions';

  const status = createElement('div', 'status');
  status.id = 'decision-list-status';
  status.setAttribute('aria-live', 'polite');
  status.tabIndex = -1;

  const list = createElement('ul', 'list');
  list.id = 'decision-list';

  container.append(title, status, list);

  function setStatus(message, isError) {
    status.textContent = message || '';
    status.className = isError ? 'status error' : 'status';
    if (isError) {
      status.focus();
    }
  }

  function setDecisions(items = []) {
    list.textContent = '';
    const entries = Array.isArray(items) ? items : [];
    if (!entries.length) {
      const empty = document.createElement('li');
      empty.textContent = 'No decisions available yet.';
      list.appendChild(empty);
      return;
    }
    entries.forEach((entry) => {
      const item = document.createElement('li');
      item.className = 'decision-list-item';
      const label = document.createElement('span');
      const titleText = entry.paper && entry.paper.title ? entry.paper.title : (entry.paper && entry.paper.paperId ? entry.paper.paperId : 'Paper');
      const state = entry.status === 'pending' ? 'Pending' : (entry.decision ? entry.decision.value : 'Missing');
      label.textContent = `${titleText} (${state})`;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'button secondary';
      button.textContent = 'Open';
      button.addEventListener('click', () => {
        if (selectHandler) {
          selectHandler(entry.paper.paperId || entry.paper.id);
        }
      });
      item.append(label, button);
      list.appendChild(item);
    });
  }

  return {
    element: container,
    setStatus,
    setDecisions,
    onSelect(handler) {
      selectHandler = handler;
    },
  };
}
