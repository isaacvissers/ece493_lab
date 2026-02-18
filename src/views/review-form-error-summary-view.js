function createElement(tag, className) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  return element;
}

export function createReviewFormErrorSummaryView(container) {
  const summary = createElement('div', 'status error');
  summary.id = 'review-form-error-summary';
  summary.tabIndex = -1;
  container.prepend(summary);

  return {
    setErrors(messages = []) {
      if (!messages.length) {
        summary.textContent = '';
        return;
      }
      summary.textContent = `Please fix the following issues: ${messages.join(', ')}`;
      summary.focus();
    },
    clear() {
      summary.textContent = '';
    },
  };
}
