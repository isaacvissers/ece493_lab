function createElement(tag, className) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  return element;
}

export function createReviewReadinessView() {
  const container = createElement('section', 'card');
  const title = createElement('h1');
  title.textContent = 'Review readiness';

  const paperMeta = createElement('p', 'helper');
  paperMeta.id = 'readiness-paper-meta';

  const authBanner = createElement('div', 'status error');
  authBanner.id = 'readiness-auth';
  authBanner.tabIndex = -1;

  const banner = createElement('div', 'status');
  banner.id = 'readiness-banner';
  banner.setAttribute('aria-live', 'polite');
  banner.tabIndex = -1;

  const count = createElement('div', 'helper');
  count.id = 'readiness-count';

  const missingInvitations = createElement('div', 'status warning');
  missingInvitations.id = 'missing-invitations';

  const guidance = createElement('div', 'helper');
  guidance.id = 'readiness-guidance';

  const startButton = createElement('button', 'button');
  startButton.id = 'start-review';
  startButton.type = 'button';
  startButton.textContent = 'Start review';

  container.append(title, paperMeta, authBanner, banner, count, missingInvitations, guidance, startButton);

  return {
    element: container,
    setPaper(paper) {
      paperMeta.textContent = paper ? `Paper ${paper.id}: ${paper.title}` : '';
    },
    setAuthorizationMessage(message) {
      authBanner.textContent = message || '';
    },
    setStatus(message, isError) {
      banner.textContent = message || '';
      banner.className = isError ? 'status error' : 'status';
      if (isError) {
        banner.focus();
      }
    },
    setCount(value) {
      if (value === null || value === undefined) {
        count.textContent = '';
        return;
      }
      count.textContent = `Current referee count: ${value}`;
    },
    setMissingInvitations(emails = []) {
      if (!emails.length) {
        missingInvitations.textContent = '';
        return;
      }
      missingInvitations.textContent = `Missing invitations: ${emails.join(', ')}`;
    },
    setGuidance(message) {
      guidance.textContent = message || '';
    },
    onStartReview(handler) {
      startButton.addEventListener('click', handler);
    },
  };
}
