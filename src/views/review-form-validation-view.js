function createElement(tag, className) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  return element;
}

export function createReviewFormValidationView(formElement) {
  const fieldErrors = new Map();

  function ensureErrorNode(fieldId) {
    if (fieldErrors.has(fieldId)) {
      return fieldErrors.get(fieldId);
    }
    const input = formElement.querySelector(`[name="${fieldId}"]`) || formElement.querySelector(`#${fieldId}`);
    const error = createElement('div', 'error');
    error.id = `${fieldId}-error`;
    error.tabIndex = -1;
    if (input) {
      input.setAttribute('aria-describedby', error.id);
      input.parentElement.appendChild(error);
    }
    fieldErrors.set(fieldId, error);
    return error;
  }

  return {
    clear() {
      fieldErrors.forEach((node) => {
        node.textContent = '';
      });
    },
    setFieldError(fieldId, message) {
      const node = ensureErrorNode(fieldId);
      node.textContent = message || '';
    },
  };
}
