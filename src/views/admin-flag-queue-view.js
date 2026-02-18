function createElement(tag, className) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  return element;
}

export function createAdminFlagQueueView() {
  const container = createElement('section', 'card');
  const title = createElement('h2');
  title.textContent = 'Admin flags';

  const list = document.createElement('ul');
  list.id = 'admin-flag-list';

  container.append(title, list);

  return {
    element: container,
    setFlags(flags = [], onResend) {
      list.innerHTML = '';
      flags.forEach((flag) => {
        const item = document.createElement('li');
        const text = document.createElement('span');
        text.textContent = `${flag.reviewId}: ${flag.reason}`;
        item.appendChild(text);
        if (onResend) {
          const button = document.createElement('button');
          button.type = 'button';
          button.textContent = 'Resend notification';
          button.addEventListener('click', () => onResend(flag));
          item.appendChild(button);
        }
        list.appendChild(item);
      });
    },
  };
}
