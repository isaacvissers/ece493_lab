function createElement(tag, className) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  return element;
}

function formatStatus(status) {
  const normalized = (status || 'submitted').toString().trim().toLowerCase();
  const map = {
    submitted: 'Submitted',
    in_review: 'Being reviewed',
    under_review: 'Being reviewed',
    being_reviewed: 'Being reviewed',
    approved: 'Approved',
    rejected: 'Rejected',
  };
  if (map[normalized]) {
    return map[normalized];
  }
  return normalized
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((word) => `${word[0].toUpperCase()}${word.slice(1)}`)
    .join(' ');
}

export function createDashboardView(user, manuscripts = []) {
  const container = createElement('section', 'card');
  const title = createElement('h1');
  title.textContent = 'Dashboard';

  const status = createElement('p', 'helper');
  if (user && user.email) {
    status.textContent = `Signed in as ${user.email}.`;
  } else {
    status.textContent = 'Signed in.';
  }

  const message = createElement('div', 'status');
  message.textContent = 'Welcome to your CMS dashboard.';

  const submissionsSection = createElement('div', 'submission-list');
  const submissionsTitle = createElement('h2');
  submissionsTitle.textContent = 'Your submissions';
  const submissionsBody = createElement('div');
  if (!manuscripts.length) {
    const empty = createElement('p', 'helper');
    empty.textContent = 'No submissions yet.';
    submissionsBody.append(empty);
  } else {
    const list = document.createElement('ul');
    list.className = 'submission-items';
    manuscripts.forEach((manuscript) => {
      const item = document.createElement('li');
      item.className = 'submission-item';
      const itemTitle = createElement('span', 'submission-title');
      itemTitle.textContent = manuscript.title || 'Untitled manuscript';
      const itemStatus = createElement('span', 'submission-status');
      itemStatus.textContent = `Status: ${formatStatus(manuscript.status)}`;
      item.append(itemTitle, itemStatus);
      list.append(item);
    });
    submissionsBody.append(list);
  }
  submissionsSection.append(submissionsTitle, submissionsBody);

  const actions = createElement('div', 'form-row');
  const submitButton = document.createElement('button');
  submitButton.type = 'button';
  submitButton.className = 'button';
  submitButton.id = 'submit-paper-button';
  submitButton.textContent = 'Submit paper';
  const changePasswordButton = document.createElement('button');
  changePasswordButton.type = 'button';
  changePasswordButton.className = 'button secondary';
  changePasswordButton.id = 'change-password-button';
  changePasswordButton.textContent = 'Change password';
  actions.append(submitButton, changePasswordButton);

  container.append(title, status, message, submissionsSection, actions);
  return {
    element: container,
    onChangePassword(handler) {
      changePasswordButton.addEventListener('click', handler);
    },
    onSubmitPaper(handler) {
      submitButton.addEventListener('click', handler);
    },
  };
}
