function createElement(tag, className) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  return element;
}

function clearNode(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

export function createScheduleHtmlView() {
  const container = createElement('section', 'card');
  const title = createElement('h1');
  title.textContent = 'Schedule (HTML)';

  const status = createElement('div', 'status');
  status.id = 'schedule-html-status';
  status.setAttribute('aria-live', 'polite');

  const loading = createElement('div', 'loading');
  loading.id = 'schedule-html-loading';
  loading.textContent = 'Loading schedule...';
  loading.setAttribute('aria-live', 'polite');
  loading.hidden = true;

  const content = createElement('div', 'schedule-html-content');
  content.id = 'schedule-html-content';

  container.append(title, status, loading, content);

  function setStatus(message, isError = false) {
    status.textContent = message || '';
    status.className = isError ? 'status error' : 'status';
  }

  function setLoading(isLoading) {
    loading.hidden = !isLoading;
  }

  function setEmpty(message = 'No schedule available.') {
    clearNode(content);
    const empty = createElement('p', 'helper');
    empty.textContent = message;
    content.appendChild(empty);
  }

  function renderRoomSection({ roomName, items }) {
    const section = createElement('section', 'schedule-room');
    const heading = createElement('h2');
    heading.textContent = roomName;
    const list = createElement('ul', 'list');
    items.forEach((item) => {
      const entry = document.createElement('li');
      const titleText = item.paperTitle || 'Untitled paper';
      const timeText = item.startTime && item.endTime ? `${item.startTime} – ${item.endTime}` : '';
      entry.textContent = timeText ? `${timeText}: ${titleText}` : titleText;
      list.appendChild(entry);
    });
    section.append(heading, list);
    return section;
  }

  function renderUnscheduledSection(items) {
    const section = createElement('section', 'schedule-unscheduled');
    const heading = createElement('h2');
    heading.textContent = 'Unscheduled';
    const list = createElement('ul', 'list');
    items.forEach((item) => {
      const entry = document.createElement('li');
      entry.textContent = item.paperTitle || 'Untitled paper';
      list.appendChild(entry);
    });
    section.append(heading, list);
    return section;
  }

  function renderSchedule({ rooms = [], unscheduled = [] } = {}) {
    clearNode(content);
    if (!rooms.length && !unscheduled.length) {
      setEmpty();
      return;
    }
    rooms.forEach((room) => {
      content.appendChild(renderRoomSection(room));
    });
    if (unscheduled.length) {
      content.appendChild(renderUnscheduledSection(unscheduled));
    }
  }

  return {
    element: container,
    setStatus,
    setLoading,
    setEmpty,
    renderSchedule,
  };
}
