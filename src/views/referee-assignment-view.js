function createElement(tag, className) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  return element;
}

function createEmailRow(index) {
  const row = createElement('div', 'form-row');
  const label = document.createElement('label');
  const id = `referee-email-${index}`;
  label.setAttribute('for', id);
  label.textContent = `Referee email ${index}`;
  const input = document.createElement('input');
  input.type = 'email';
  input.id = id;
  input.name = id;
  const error = createElement('div', 'error');
  error.id = `${id}-error`;
  input.setAttribute('aria-describedby', error.id);
  row.append(label, input, error);
  return { row, input, error };
}

export function createRefereeAssignmentView() {
  const container = createElement('section', 'card');
  const title = createElement('h1');
  title.textContent = 'Assign referees';

  const banner = createElement('div', 'status');
  banner.id = 'assignment-banner';
  banner.setAttribute('aria-live', 'polite');

  const warning = createElement('div', 'status warning');
  warning.id = 'notification-warning';

  const authBanner = createElement('div', 'status error');
  authBanner.id = 'authorization-banner';

  const summary = document.createElement('ul');
  summary.id = 'assignment-summary';
  summary.className = 'helper';

  const paperMeta = createElement('p', 'helper');
  paperMeta.id = 'paper-meta';

  const form = document.createElement('form');
  form.noValidate = true;

  const emailRows = [1, 2, 3].map((index) => createEmailRow(index));
  const countError = createElement('div', 'error');
  countError.id = 'referee-count-error';

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.className = 'button';
  submitButton.textContent = 'Assign referees';

  form.append(
    ...emailRows.map((row) => row.row),
    countError,
    submitButton,
  );

  container.append(title, paperMeta, authBanner, warning, banner, summary, form);

  function clearErrors() {
    emailRows.forEach((row) => {
      row.error.textContent = '';
    });
    countError.textContent = '';
    banner.textContent = '';
    banner.className = 'status';
    summary.textContent = '';
  }

  function setEditable(enabled) {
    const disabled = !enabled;
    emailRows.forEach((row) => {
      row.input.disabled = disabled;
    });
    submitButton.disabled = disabled;
  }

  return {
    element: container,
    setPaper(paper) {
      paperMeta.textContent = paper ? `Paper ${paper.id}: ${paper.title}` : '';
    },
    getRefereeEmails() {
      return emailRows.map((row) => row.input.value);
    },
    setFieldError(index, message) {
      const target = emailRows[index];
      if (!target) {
        return;
      }
      target.error.textContent = message;
    },
    setCountError(message) {
      countError.textContent = message || '';
    },
    clearErrors,
    setStatus(message, isError) {
      banner.textContent = message;
      banner.className = isError ? 'status error' : 'status';
    },
    setWarning(message) {
      warning.textContent = message || '';
    },
    setAuthorizationMessage(message) {
      authBanner.textContent = message || '';
    },
    setSummary(result) {
      summary.textContent = '';
      if (!result) {
        return;
      }
      const { assigned = [], rejected = [] } = result;
      const items = [];
      assigned.forEach((email) => {
        const item = document.createElement('li');
        item.textContent = `Assigned: ${email}`;
        items.push(item);
      });
      rejected.forEach((entry) => {
        const item = document.createElement('li');
        item.textContent = `Rejected: ${entry.email} (${entry.reason})`;
        items.push(item);
      });
      if (items.length) {
        summary.append(...items);
      }
    },
    setEditable,
    showConfirmation(paperId, emails) {
      banner.textContent = `Assignment saved for ${paperId}: ${emails.join(', ')}.`;
      banner.className = 'status';
    },
    onSubmit(handler) {
      form.addEventListener('submit', handler);
    },
  };
}
