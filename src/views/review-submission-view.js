function createElement(tag, className) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  return element;
}

export function createReviewSubmissionView() {
  const container = createElement('section', 'card');
  const banner = createElement('div', 'status');
  banner.id = 'review-submission-banner';
  banner.setAttribute('aria-live', 'polite');
  banner.tabIndex = -1;

  const warning = createElement('div', 'status warning');
  warning.id = 'review-submission-warning';

  container.append(banner, warning);

  function setStatus(message, isError) {
    banner.textContent = message || '';
    banner.className = isError ? 'status error' : 'status';
    if (isError) {
      banner.focus();
    }
  }

  return {
    element: container,
    setStatus,
    setFinalityMessage(message) {
      warning.textContent = message || '';
    },
    setNotificationWarning(message) {
      warning.textContent = message || '';
    },
  };
}
