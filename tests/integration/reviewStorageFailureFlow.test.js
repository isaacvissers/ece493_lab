import { createReviewValidationView } from '../../src/views/review-validation-view.js';
import { createReviewErrorSummaryView } from '../../src/views/review-error-summary-view.js';
import { createReviewValidationController } from '../../src/controllers/review-validation-controller.js';
import { reviewFormStore } from '../../src/services/review-form-store.js';
import { reviewStorageService } from '../../src/services/review-storage-service.js';
import { errorLog } from '../../src/services/error-log.js';
import { createReviewForm } from '../../src/models/review-form.js';

beforeEach(() => {
  reviewFormStore.reset();
  reviewStorageService.reset();
  errorLog.clear();
  document.body.innerHTML = '';
});

test('storage failure after validation shows error and logs', () => {
  reviewFormStore.saveForm(createReviewForm({
    paperId: 'form_storage',
    requiredFields: ['summary'],
  }));
  reviewStorageService.setFailureMode(true);

  const view = createReviewValidationView();
  const summaryView = createReviewErrorSummaryView(view.element);
  document.body.appendChild(view.element);

  const controller = createReviewValidationController({
    view,
    summaryView,
    formId: 'form_storage',
  });
  controller.init();

  view.element.querySelector('[name="summary"]').value = 'Summary';
  view.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

  expect(view.element.querySelector('#review-validation-banner').textContent).toContain('could not save');
  expect(errorLog.getFailures().some((entry) => entry.errorType === 'review_storage_failure')).toBe(true);
});
