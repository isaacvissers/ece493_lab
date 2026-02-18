function createElement(tag, className) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  return element;
}

export function createEditorNotificationsView() {
  const container = createElement('section', 'card');
  const title = createElement('h2');
  title.textContent = 'Notifications';

  const list = document.createElement('ul');
  list.id = 'editor-notifications';

  container.append(title, list);

  return {
    element: container,
    setNotifications(notifications = []) {
      list.innerHTML = '';
      notifications.forEach((note) => {
        const item = document.createElement('li');
        item.textContent = `Review ${note.reviewId} notification: ${note.status}`;
        list.appendChild(item);
      });
    },
  };
}
