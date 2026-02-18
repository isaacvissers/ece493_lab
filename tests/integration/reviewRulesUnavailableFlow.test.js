import { createReviewValidationView } from '../../src/views/review-validation-view.js';
import { createReviewErrorSummaryView } from '../../src/views/review-error-summary-view.js';
import { createReviewValidationController } from '../../src/controllers/review-validation-controller.js';
import { reviewFormStore } from '../../src/services/review-form-store.js';
import { errorLog } from '../../src/services/error-log.js';

beforeEach(() => {
  reviewFormStore.reset();
  errorLog.clear();
  document.body.innerHTML = '';
});

test('rules unavailable blocks action and logs', () => {
  const view = createReviewValidationView();
  const summaryView = createReviewErrorSummaryView(view.element);
  document.body.appendChild(view.element);

  const controller = createReviewValidationController({
    view,
    summaryView,
    formId: 'missing_form',
  });
  controller.init();

  view.element.querySelector('#save-draft').click();

  expect(view.element.querySelector('#review-validation-banner').textContent).toContain('unavailable');
  expect(errorLog.getFailures().some((entry) => entry.errorType === 'validation_rules_unavailable')).toBe(true);
});
