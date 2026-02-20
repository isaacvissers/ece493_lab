function createElement(tag, className) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  return element;
}

export function createScheduleAnnouncementView() {
  const container = createElement('section', 'card');
  container.id = 'schedule-announcement';
  const title = createElement('h2');
  title.textContent = 'Final schedule announcement';
  const summary = createElement('p', 'helper');
  summary.textContent = 'The final schedule will be announced here.';
  const status = createElement('div', 'status');
  status.setAttribute('aria-live', 'polite');
  const link = document.createElement('a');
  link.className = 'button';
  link.textContent = 'View public schedule';
  link.href = '/public/schedule';

  container.append(title, summary, status, link);

  function setAnnouncement({ titleText, summaryText, scheduleLink, lastUpdatedAt } = {}) {
    title.textContent = titleText || 'Final schedule published';
    summary.textContent = summaryText || 'The final conference schedule is now available.';
    if (scheduleLink) {
      link.href = scheduleLink;
    }
    link.hidden = false;
    const updated = lastUpdatedAt ? `Last updated: ${lastUpdatedAt}` : '';
    status.textContent = updated;
    status.className = 'status';
  }

  function setPending(message = 'Schedule not available yet.') {
    status.textContent = message;
    status.className = 'status';
    link.hidden = true;
  }

  return {
    element: container,
    setAnnouncement,
    setPending,
  };
}
