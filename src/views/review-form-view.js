function createElement(tag, className) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  return element;
}

export function createReviewFormView() {
  const container = createElement('section', 'card');
  const title = createElement('h1');
  title.textContent = 'Review form';

  const banner = createElement('div', 'status');
  banner.id = 'review-form-banner';
  banner.setAttribute('aria-live', 'polite');
  banner.tabIndex = -1;

  const closedMessage = createElement('div', 'status warning');
  closedMessage.id = 'review-form-closed';

  const form = document.createElement('form');
  form.noValidate = true;

  const contentLabel = document.createElement('label');
  contentLabel.setAttribute('for', 'review-content');
  contentLabel.textContent = 'Review content';

  const contentField = document.createElement('textarea');
  contentField.id = 'review-content';
  contentField.name = 'review-content';

  const submitButton = createElement('button', 'button');
  submitButton.type = 'submit';
  submitButton.textContent = 'Submit review';

  form.append(contentLabel, contentField, submitButton);
  container.append(title, banner, closedMessage, form);

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
    setForm(formConfig) {
      if (!formConfig) {
        title.textContent = 'Review form';
        return;
      }
      title.textContent = `Review form for ${formConfig.paperId}`;
    },
    setDraft(draft) {
      if (draft && draft.content && draft.content.text) {
        contentField.value = draft.content.text;
      }
    },
    setViewOnly(enabled, message) {
      contentField.disabled = Boolean(enabled);
      submitButton.disabled = Boolean(enabled);
      closedMessage.textContent = enabled ? (message || 'Review period is closed. View-only access.') : '';
    },
  };
}
