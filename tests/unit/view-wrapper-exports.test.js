import { createReviewErrorSummaryView } from '../../src/views/reviewErrorSummaryView.js';
import { reviewValidationAccessibility } from '../../src/views/reviewValidationAccessibility.js';
import { createReviewValidationView } from '../../src/views/reviewValidationView.js';

import { createReviewErrorSummaryView as createReviewErrorSummaryViewImpl } from '../../src/views/review-error-summary-view.js';
import { reviewValidationAccessibility as reviewValidationAccessibilityImpl } from '../../src/views/review-validation-accessibility.js';
import { createReviewValidationView as createReviewValidationViewImpl } from '../../src/views/review-validation-view.js';

test('view wrapper modules re-export implementations', () => {
  expect(createReviewErrorSummaryView).toBe(createReviewErrorSummaryViewImpl);
  expect(reviewValidationAccessibility).toBe(reviewValidationAccessibilityImpl);
  expect(createReviewValidationView).toBe(createReviewValidationViewImpl);
});
