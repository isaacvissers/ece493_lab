import { createReviewValidationView } from '../../src/views/review-validation-view.js';
import { createReviewErrorSummaryView } from '../../src/views/review-error-summary-view.js';
import { createReviewValidationController } from '../../src/controllers/review-validation-controller.js';
import { reviewFormStore } from '../../src/services/review-form-store.js';
import { createReviewForm } from '../../src/models/review-form.js';

beforeEach(() => {
  reviewFormStore.reset();
  document.body.innerHTML = '';
});

test('focuses error summary on validation errors', () => {
  reviewFormStore.saveForm(createReviewForm({
    paperId: 'form_access',
    requiredFields: ['summary'],
  }));

  const view = createReviewValidationView();
  const summaryView = createReviewErrorSummaryView(view.element);
  document.body.appendChild(view.element);

  const controller = createReviewValidationController({
    view,
    summaryView,
    formId: 'form_access',
  });
  controller.init();

  view.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

  expect(document.activeElement.id).toBe('review-validation-error-summary');
});
