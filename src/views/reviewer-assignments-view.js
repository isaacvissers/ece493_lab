function createElement(tag, className) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  return element;
}

export function createReviewerAssignmentsView() {
  let openHandler = null;
  let alertFailureMode = false;

  const container = createElement('section', 'card');
  const title = createElement('h1');
  title.textContent = 'Assigned papers';

  const banner = createElement('div', 'status');
  banner.id = 'assignments-banner';
  banner.setAttribute('aria-live', 'polite');
  banner.tabIndex = -1;

  const alert = createElement('div', 'status warning');
  alert.id = 'overassignment-alert';
  alert.tabIndex = -1;

  const alertFallback = createElement('div', 'status error');
  alertFallback.id = 'overassignment-alert-fallback';

  const list = createElement('ul', 'list');
  list.id = 'assignments-list';

  const refreshButton = createElement('button', 'button secondary');
  refreshButton.id = 'assignments-refresh';
  refreshButton.type = 'button';
  refreshButton.textContent = 'Refresh list';

  container.append(title, banner, alert, alertFallback, refreshButton, list);

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

  function setAssignments(assignments = []) {
    clearList();
    if (!assignments.length) {
      const item = document.createElement('li');
      item.textContent = 'No accepted assignments found. If you recently accepted, refresh or contact the editor.';
      list.appendChild(item);
      return;
    }
    assignments.forEach((assignment) => {
      const item = document.createElement('li');
      const label = document.createElement('span');
      label.textContent = assignment.title || assignment.paperId;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'button secondary';
      button.textContent = 'Open';
      button.addEventListener('click', () => {
        if (openHandler) {
          openHandler(assignment);
        }
      });
      item.append(label, button);
      list.appendChild(item);
    });
  }

  return {
    element: container,
    setStatus,
    setAssignments,
    setAlert({ message = '' } = {}) {
      alert.textContent = '';
      alertFallback.textContent = '';
      if (alertFailureMode) {
        return false;
      }
      alert.textContent = message;
      if (message) {
        alert.focus();
      }
      return true;
    },
    setAlertFallback(message) {
      alertFallback.textContent = message || '';
    },
    setAlertFailureMode(enabled) {
      alertFailureMode = Boolean(enabled);
    },
    onRefresh(handler) {
      refreshButton.addEventListener('click', handler);
    },
    onOpen(handler) {
      openHandler = handler;
    },
  };
}
