export const reviewValidationAccessibility = {
  focusFirstError(container) {
    const summary = container.querySelector('#review-validation-error-summary');
    if (summary && summary.textContent.trim()) {
      summary.focus();
      return true;
    }
    const error = container.querySelector('.error');
    if (error) {
      error.focus();
      return true;
    }
    return false;
  },
};
