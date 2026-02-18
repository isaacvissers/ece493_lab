function createElement(tag, className) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  return element;
}

export function createReviewErrorSummaryView(container) {
  const summary = createElement('div', 'status error');
  summary.id = 'review-validation-error-summary';
  summary.tabIndex = -1;
  container.prepend(summary);

  return {
    setErrors(errors = []) {
      if (!errors.length) {
        summary.textContent = '';
        return;
      }
      const messages = errors.map((entry) => entry.message || entry.field || 'Invalid field');
      summary.textContent = `Please fix the following issues: ${messages.join(', ')}`;
      summary.focus();
    },
    clear() {
      summary.textContent = '';
    },
  };
}
