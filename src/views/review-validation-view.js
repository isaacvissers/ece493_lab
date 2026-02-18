function createElement(tag, className) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  return element;
}

export function createReviewValidationView() {
  const container = createElement('section', 'card');
  const title = createElement('h1');
  title.textContent = 'Review validation';

  const banner = createElement('div', 'status');
  banner.id = 'review-validation-banner';
  banner.setAttribute('aria-live', 'polite');
  banner.tabIndex = -1;

  const form = document.createElement('form');
  form.noValidate = true;

  function createField(id, labelText, element) {
    const label = document.createElement('label');
    label.setAttribute('for', id);
    label.textContent = labelText;
    element.id = id;
    return { label, element };
  }

  const summaryField = createField('review-summary', 'Summary', document.createElement('textarea'));
  summaryField.element.name = 'summary';

  const commentsField = createField('review-comments', 'Comments to authors', document.createElement('textarea'));
  commentsField.element.name = 'commentsToAuthors';

  const recommendationField = createField('review-recommendation', 'Recommendation', document.createElement('select'));
  recommendationField.element.name = 'recommendation';
  ['select', 'accept', 'minor_revision', 'major_revision', 'reject'].forEach((option) => {
    const entry = document.createElement('option');
    entry.value = option === 'select' ? '' : option;
    entry.textContent = option === 'select' ? 'Select recommendation' : option.replace('_', ' ');
    recommendationField.element.appendChild(entry);
  });

  const confidenceField = createField('review-confidence', 'Confidence rating (1-5)', document.createElement('input'));
  confidenceField.element.type = 'number';
  confidenceField.element.name = 'confidenceRating';
  confidenceField.element.min = '1';
  confidenceField.element.max = '5';

  const saveButton = createElement('button', 'button secondary');
  saveButton.type = 'button';
  saveButton.id = 'save-draft';
  saveButton.textContent = 'Save draft';

  const submitButton = createElement('button', 'button');
  submitButton.type = 'submit';
  submitButton.textContent = 'Submit review';

  form.append(
    summaryField.label,
    summaryField.element,
    commentsField.label,
    commentsField.element,
    recommendationField.label,
    recommendationField.element,
    confidenceField.label,
    confidenceField.element,
    saveButton,
    submitButton,
  );

  container.append(title, banner, form);

  const fieldErrors = new Map();

  function ensureErrorNode(fieldId, input) {
    if (fieldErrors.has(fieldId)) {
      return fieldErrors.get(fieldId);
    }
    const error = createElement('div', 'error');
    error.id = `${fieldId}-error`;
    error.tabIndex = -1;
    input.setAttribute('aria-describedby', error.id);
    input.parentElement.appendChild(error);
    fieldErrors.set(fieldId, error);
    return error;
  }

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
    getValues() {
      return {
        summary: summaryField.element.value,
        commentsToAuthors: commentsField.element.value,
        recommendation: recommendationField.element.value,
        confidenceRating: confidenceField.element.value,
      };
    },
    clearErrors() {
      fieldErrors.forEach((node) => {
        node.textContent = '';
      });
      [summaryField.element, commentsField.element, recommendationField.element, confidenceField.element]
        .forEach((input) => input.classList.remove('invalid'));
    },
    setFieldError(fieldId, message) {
      const input = form.querySelector(`[name="${fieldId}"]`) || form.querySelector(`#${fieldId}`);
      if (!input) {
        return;
      }
      const node = ensureErrorNode(fieldId, input);
      node.textContent = message || '';
      input.classList.add('invalid');
    },
    onSaveDraft(handler) {
      saveButton.addEventListener('click', handler);
    },
    onSubmitReview(handler) {
      form.addEventListener('submit', handler);
    },
  };
}
