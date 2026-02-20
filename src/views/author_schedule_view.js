function createElement(tag, className) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  return element;
}

function clearList(list, emptyMessage) {
  list.textContent = '';
  const empty = document.createElement('li');
  empty.textContent = emptyMessage;
  list.appendChild(empty);
}

export function createAuthorScheduleView() {
  const container = createElement('section', 'card');
  const title = createElement('h1');
  title.textContent = 'My schedule';

  const helper = createElement('p', 'helper');
  helper.textContent = 'Final time and room details for your accepted papers.';

  const status = createElement('div', 'status');
  status.id = 'author-schedule-status';
  status.setAttribute('aria-live', 'polite');

  const summary = createElement('p', 'helper');
  summary.id = 'author-schedule-summary';
  summary.setAttribute('aria-live', 'polite');

  const scheduledTitle = createElement('h2');
  scheduledTitle.textContent = 'Scheduled';
  const scheduledList = createElement('ul', 'list');
  scheduledList.id = 'author-schedule-list';
  scheduledList.setAttribute('aria-live', 'polite');

  const unscheduledTitle = createElement('h2');
  unscheduledTitle.textContent = 'Unscheduled';
  const unscheduledList = createElement('ul', 'list');
  unscheduledList.id = 'author-schedule-unscheduled';
  unscheduledList.setAttribute('aria-live', 'polite');

  container.append(title, helper, status, summary, scheduledTitle, scheduledList, unscheduledTitle, unscheduledList);

  function setStatus(message, isError = false) {
    status.textContent = message || '';
    status.className = isError ? 'status error' : 'status';
  }

  function renderScheduled(items) {
    if (!items.length) {
      clearList(scheduledList, 'No scheduled papers yet.');
      return;
    }
    scheduledList.textContent = '';
    items.forEach((item) => {
      const entry = document.createElement('li');
      const titleText = item.paperTitle || item.paperId || 'Untitled paper';
      const roomText = item.roomName || item.roomId || 'TBD room';
      const timeText = item.startTime && item.endTime
        ? `${item.startTime} - ${item.endTime}`
        : 'TBD time';
      entry.textContent = `${titleText} - ${roomText} (${timeText})`;
      scheduledList.appendChild(entry);
    });
  }

  function renderUnscheduled(items) {
    if (!items.length) {
      clearList(unscheduledList, 'No unscheduled papers.');
      return;
    }
    unscheduledList.textContent = '';
    items.forEach((item) => {
      const entry = document.createElement('li');
      const titleText = item.paperTitle || item.paperId || 'Untitled paper';
      entry.textContent = `${titleText} - Unscheduled. Contact the organizer.`;
      unscheduledList.appendChild(entry);
    });
  }

  function setSchedule({ scheduled = [], unscheduled = [], summaryText = '' } = {}) {
    summary.textContent = summaryText;
    renderScheduled(Array.isArray(scheduled) ? scheduled : []);
    renderUnscheduled(Array.isArray(unscheduled) ? unscheduled : []);
  }

  function setPending(message = 'Schedule not available yet.') {
    setStatus(message, false);
    setSchedule({ scheduled: [], unscheduled: [], summaryText: '' });
  }

  return {
    element: container,
    setStatus,
    setSchedule,
    setPending,
  };
}
