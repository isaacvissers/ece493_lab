function createElement(tag, className) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  return element;
}

export function createNotificationInboxView() {
  const container = createElement('section', 'card');
  const title = createElement('h2');
  title.textContent = 'Notifications';

  const list = createElement('ul', 'list');
  list.id = 'notification-inbox';

  container.append(title, list);

  function setNotifications(entries = []) {
    list.textContent = '';
    const items = Array.isArray(entries) ? entries : [];
    if (!items.length) {
      const empty = document.createElement('li');
      empty.textContent = 'No notifications yet.';
      list.appendChild(empty);
      return;
    }
    items.forEach((entry) => {
      const item = document.createElement('li');
      const channel = entry.channel || (entry.channels && entry.channels[0]) || 'in_app';
      item.textContent = `${channel}: ${entry.paperId || entry.editorId || 'paper'}`;
      list.appendChild(item);
    });
  }

  return {
    element: container,
    setNotifications,
  };
}
