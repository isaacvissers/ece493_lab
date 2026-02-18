function createElement(tag, className) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  return element;
}

export function createRefereeGuidanceView() {
  let currentAction = null;
  let actionHandler = null;

  const container = createElement('section', 'helper');
  const message = createElement('div', 'status');
  message.id = 'guidance-message';

  const actionButton = createElement('button', 'button');
  actionButton.id = 'guidance-action';
  actionButton.type = 'button';

  actionButton.addEventListener('click', () => {
    if (actionHandler && currentAction) {
      actionHandler(currentAction);
    }
  });

  container.append(message, actionButton);

  return {
    element: container,
    setGuidance({ message: text = '', actionLabel = '', action = null } = {}) {
      message.textContent = text;
      actionButton.textContent = actionLabel;
      actionButton.disabled = !actionLabel;
      currentAction = action;
    },
    onAction(handler) {
      actionHandler = handler;
    },
  };
}
