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

function formatAuthors(authors) {
  if (!Array.isArray(authors) || !authors.length) {
    return 'Authors unavailable';
  }
  return authors.join(', ');
}

export function createPublicScheduleView() {
  const container = createElement('section', 'card');
  const title = createElement('h1');
  title.textContent = 'Conference schedule';

  const updated = createElement('p', 'helper');
  updated.id = 'public-schedule-updated';

  const status = createElement('div', 'status');
  status.id = 'public-schedule-status';
  status.setAttribute('aria-live', 'polite');

  const loading = createElement('div', 'loading');
  loading.id = 'public-schedule-loading';
  loading.textContent = 'Loading schedule...';
  loading.setAttribute('aria-live', 'polite');
  loading.hidden = true;

  const content = createElement('div', 'public-schedule-content');
  content.id = 'public-schedule-content';

  container.append(title, updated, status, loading, content);

  function setStatus(message, isError = false) {
    status.textContent = message || '';
    status.className = isError ? 'status error' : 'status';
  }

  function setLoading(isLoading) {
    loading.hidden = !isLoading;
  }

  function setLastUpdated(value) {
    updated.textContent = value ? `Last updated: ${value}` : '';
  }

  function setEmpty(message = 'No schedule available.') {
    clearNode(content);
    const empty = createElement('p', 'helper');
    empty.textContent = message;
    content.appendChild(empty);
  }

  function renderDaySection(dayLabel, entries) {
    const section = createElement('section', 'public-schedule-day');
    const heading = createElement('h2');
    heading.textContent = dayLabel;
    const table = document.createElement('table');
    table.className = 'public-schedule-table';
    const headRow = document.createElement('tr');
    ['Time', 'Room', 'Session', 'Title', 'Authors', 'Abstract'].forEach((label) => {
      const th = document.createElement('th');
      th.scope = 'col';
      th.textContent = label;
      headRow.appendChild(th);
    });
    const thead = document.createElement('thead');
    thead.appendChild(headRow);
    const tbody = document.createElement('tbody');
    entries.forEach((entry) => {
      const row = document.createElement('tr');
      const cells = [
        entry.time || 'TBD time',
        entry.room || 'TBD room',
        entry.session || 'Session',
        entry.paperTitle || 'Untitled paper',
        formatAuthors(entry.authors),
        entry.abstract || 'Abstract not available.',
      ];
      cells.forEach((value) => {
        const td = document.createElement('td');
        td.textContent = value;
        row.appendChild(td);
      });
      tbody.appendChild(row);
    });
    table.append(thead, tbody);
    section.append(heading, table);
    return section;
  }

  function renderUnscheduledSection(items) {
    const section = createElement('section', 'public-schedule-unscheduled');
    const heading = createElement('h2');
    heading.textContent = 'Unscheduled';
    const list = createElement('ul', 'list');
    items.forEach((entry) => {
      const item = document.createElement('li');
      const titleText = entry.paperTitle || 'Untitled paper';
      const authorText = formatAuthors(entry.authors);
      item.textContent = `${titleText} - Unscheduled (${authorText})`;
      list.appendChild(item);
    });
    section.append(heading, list);
    return section;
  }

  function renderSchedule({ entries = [], unscheduled = [], lastUpdatedAt = '' } = {}) {
    setLastUpdated(lastUpdatedAt);
    clearNode(content);
    if (!entries.length && !unscheduled.length) {
      setEmpty();
      return;
    }
    const days = new Map();
    entries.forEach((entry) => {
      const key = entry.day || 'TBD day';
      if (!days.has(key)) {
        days.set(key, []);
      }
      days.get(key).push(entry);
    });
    Array.from(days.keys()).sort().forEach((day) => {
      content.appendChild(renderDaySection(day, days.get(day)));
    });
    if (unscheduled.length) {
      content.appendChild(renderUnscheduledSection(unscheduled));
    }
  }

  function setPending(message = 'Schedule not available yet.') {
    setStatus(message, false);
    setLastUpdated('');
    setLoading(false);
    setEmpty(message);
  }

  return {
    element: container,
    setStatus,
    setLoading,
    setPending,
    renderSchedule,
    setLastUpdated,
    setEmpty,
  };
}
