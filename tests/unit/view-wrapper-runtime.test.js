import { createReviewErrorSummaryView } from '../../src/views/reviewErrorSummaryView.js';
import { reviewValidationAccessibility } from '../../src/views/reviewValidationAccessibility.js';
import { createReviewValidationView } from '../../src/views/reviewValidationView.js';

import { createReviewErrorSummaryView as createReviewErrorSummaryViewImpl } from '../../src/views/review-error-summary-view.js';
import { reviewValidationAccessibility as reviewValidationAccessibilityImpl } from '../../src/views/review-validation-accessibility.js';
import { createReviewValidationView as createReviewValidationViewImpl } from '../../src/views/review-validation-view.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

test('view wrappers execute and forward to implementations', () => {
  expect(createReviewErrorSummaryView).toBe(createReviewErrorSummaryViewImpl);
  expect(reviewValidationAccessibility).toBe(reviewValidationAccessibilityImpl);
  expect(createReviewValidationView).toBe(createReviewValidationViewImpl);

  const container = document.createElement('div');
  document.body.appendChild(container);
  const summary = createReviewErrorSummaryView(container);
  summary.setErrors([{ field: 'summary', message: 'Summary required.' }]);

  const form = document.createElement('form');
  document.body.appendChild(form);
  const validationView = createReviewValidationView(form);
  validationView.setFieldError('summary', 'Summary required.');

  reviewValidationAccessibility.focusFirstError(document.body);
});
