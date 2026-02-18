import { createReviewValidationView } from '../../src/views/review-validation-view.js';
import { createReviewErrorSummaryView } from '../../src/views/review-error-summary-view.js';
import { createReviewValidationController } from '../../src/controllers/review-validation-controller.js';
import { reviewFormStore } from '../../src/services/review-form-store.js';
import { createReviewForm } from '../../src/models/review-form.js';

beforeEach(() => {
  reviewFormStore.reset();
  document.body.innerHTML = '';
});

test('blank required field blocks submission', () => {
  reviewFormStore.saveForm(createReviewForm({
    paperId: 'form_blank',
    requiredFields: ['summary'],
  }));

  const view = createReviewValidationView();
  const summaryView = createReviewErrorSummaryView(view.element);
  document.body.appendChild(view.element);

  const controller = createReviewValidationController({
    view,
    summaryView,
    formId: 'form_blank',
  });
  controller.init();

  view.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

  expect(view.element.querySelector('#review-validation-error-summary').textContent).toContain('required');
  expect(view.element.querySelector('#review-validation-banner').textContent).toContain('correct');
});
