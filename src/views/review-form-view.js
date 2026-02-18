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
  contentLabel.textContent = 'Review summary';

  const contentField = document.createElement('textarea');
  contentField.id = 'review-content';
  contentField.name = 'summary';

  const commentsLabel = document.createElement('label');
  commentsLabel.setAttribute('for', 'review-comments');
  commentsLabel.textContent = 'Comments to authors';

  const commentsField = document.createElement('textarea');
  commentsField.id = 'review-comments';
  commentsField.name = 'commentsToAuthors';

  const recommendationLabel = document.createElement('label');
  recommendationLabel.setAttribute('for', 'review-recommendation');
  recommendationLabel.textContent = 'Recommendation';

  const recommendationField = document.createElement('select');
  recommendationField.id = 'review-recommendation';
  recommendationField.name = 'recommendation';
  ['select', 'accept', 'minor_revision', 'major_revision', 'reject'].forEach((option) => {
    const entry = document.createElement('option');
    entry.value = option === 'select' ? '' : option;
    entry.textContent = option === 'select' ? 'Select recommendation' : option.replace('_', ' ');
    recommendationField.appendChild(entry);
  });

  const confidenceLabel = document.createElement('label');
  confidenceLabel.setAttribute('for', 'review-confidence');
  confidenceLabel.textContent = 'Confidence rating (1-5)';

  const confidenceField = document.createElement('input');
  confidenceField.type = 'number';
  confidenceField.id = 'review-confidence';
  confidenceField.name = 'confidenceRating';
  confidenceField.min = '1';
  confidenceField.max = '5';

  const confirmLabel = document.createElement('label');
  confirmLabel.setAttribute('for', 'review-confirm');
  confirmLabel.textContent = 'I confirm this review is final.';

  const confirmField = document.createElement('input');
  confirmField.type = 'checkbox';
  confirmField.id = 'review-confirm';
  confirmField.name = 'review-confirm';

  const submitButton = createElement('button', 'button');
  submitButton.type = 'submit';
  submitButton.textContent = 'Submit review';

  form.append(
    contentLabel,
    contentField,
    commentsLabel,
    commentsField,
    recommendationLabel,
    recommendationField,
    confidenceLabel,
    confidenceField,
    confirmLabel,
    confirmField,
    submitButton,
  );
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
      if (draft && draft.content) {
        if (draft.content.summary || draft.content.text) {
          contentField.value = draft.content.summary || draft.content.text;
        }
        if (draft.content.commentsToAuthors) {
          commentsField.value = draft.content.commentsToAuthors;
        }
        if (draft.content.recommendation) {
          recommendationField.value = draft.content.recommendation;
        }
        if (draft.content.confidenceRating) {
          confidenceField.value = draft.content.confidenceRating;
        }
      }
    },
    setViewOnly(enabled, message) {
      contentField.disabled = Boolean(enabled);
      commentsField.disabled = Boolean(enabled);
      recommendationField.disabled = Boolean(enabled);
      confidenceField.disabled = Boolean(enabled);
      confirmField.disabled = Boolean(enabled);
      submitButton.disabled = Boolean(enabled);
      closedMessage.textContent = enabled ? (message || 'Review period is closed. View-only access.') : '';
    },
    getValues() {
      return {
        summary: contentField.value,
        commentsToAuthors: commentsField.value,
        recommendation: recommendationField.value,
        confidenceRating: confidenceField.value,
      };
    },
    isConfirmed() {
      return confirmField.checked;
    },
    onSubmit(handler) {
      form.addEventListener('submit', handler);
    },
  };
}
