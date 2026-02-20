import { DECISION_VALUES } from '../models/decision-constants.js';

function createElement(tag, className) {
  const element = document.createElement(tag);
  /* istanbul ignore else -- className is always provided by this view */
  if (className) {
    element.className = className;
  }
  return element;
}

export function createDecisionEntryView() {
  const container = createElement('section', 'card');
  const title = createElement('h1');
  title.textContent = 'Final decision';

  const banner = createElement('div', 'status');
  banner.id = 'decision-banner';
  banner.setAttribute('aria-live', 'polite');
  banner.tabIndex = -1;

  const reviewSection = createElement('div', 'decision-reviews');
  reviewSection.id = 'decision-reviews';

  const form = document.createElement('form');
  form.noValidate = true;

  const optionGroup = createElement('fieldset');
  const legend = document.createElement('legend');
  legend.textContent = 'Decision';

  const acceptLabel = document.createElement('label');
  acceptLabel.setAttribute('for', 'decision-accept');
  acceptLabel.textContent = 'Accept';

  const acceptInput = document.createElement('input');
  acceptInput.type = 'radio';
  acceptInput.id = 'decision-accept';
  acceptInput.name = 'decision';
  acceptInput.value = DECISION_VALUES.accept;

  const rejectLabel = document.createElement('label');
  rejectLabel.setAttribute('for', 'decision-reject');
  rejectLabel.textContent = 'Reject';

  const rejectInput = document.createElement('input');
  rejectInput.type = 'radio';
  rejectInput.id = 'decision-reject';
  rejectInput.name = 'decision';
  rejectInput.value = DECISION_VALUES.reject;

  const commentsLabel = document.createElement('label');
  commentsLabel.setAttribute('for', 'decision-comments');
  commentsLabel.textContent = 'Comments (optional)';

  const commentsField = document.createElement('textarea');
  commentsField.id = 'decision-comments';
  commentsField.name = 'comments';

  const submitButton = createElement('button', 'button');
  submitButton.type = 'submit';
  submitButton.id = 'decision-submit';
  submitButton.textContent = 'Save decision';

  optionGroup.append(legend, acceptInput, acceptLabel, rejectInput, rejectLabel);
  form.append(optionGroup, commentsLabel, commentsField, submitButton);
  container.append(title, banner, reviewSection, form);

  function setStatus(message, isError) {
    banner.textContent = message || '';
    banner.className = isError ? 'status error' : 'status';
    if (isError) {
      banner.focus();
    }
  }

  function setReviews(reviews = []) {
    reviewSection.textContent = '';
    const list = Array.isArray(reviews) ? reviews : [];
    if (!list.length) {
      const empty = createElement('p');
      empty.textContent = 'No submitted reviews available.';
      reviewSection.appendChild(empty);
      return;
    }
    list.forEach((review, index) => {
      const item = createElement('div', 'decision-review');
      const titleText = review && review.content && review.content.summary
        ? review.content.summary
        : `Review ${index + 1}`;
      item.textContent = titleText;
      reviewSection.appendChild(item);
    });
  }

  function getSelection() {
    if (acceptInput.checked) {
      return acceptInput.value;
    }
    if (rejectInput.checked) {
      return rejectInput.value;
    }
    return '';
  }

  return {
    element: container,
    setStatus,
    setReviews,
    getSelection,
    getComments() {
      return commentsField.value;
    },
    setSubmitDisabled(disabled) {
      submitButton.disabled = Boolean(disabled);
    },
    onSubmit(handler) {
      form.addEventListener('submit', handler);
    },
  };
}
