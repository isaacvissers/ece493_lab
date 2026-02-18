import { createReviewValidationView } from '../../src/views/review-validation-view.js';
import { createReviewErrorSummaryView } from '../../src/views/review-error-summary-view.js';
import { createReviewValidationController } from '../../src/controllers/review-validation-controller.js';
import { reviewFormStore } from '../../src/services/review-form-store.js';
import { createReviewForm } from '../../src/models/review-form.js';

beforeEach(() => {
  reviewFormStore.reset();
  document.body.innerHTML = '';
});

test('max length violation shows guidance', () => {
  reviewFormStore.saveForm(createReviewForm({
    paperId: 'form_max',
    requiredFields: ['summary'],
    maxLengths: { summary: 5 },
  }));

  const view = createReviewValidationView();
  const summaryView = createReviewErrorSummaryView(view.element);
  document.body.appendChild(view.element);

  const controller = createReviewValidationController({
    view,
    summaryView,
    formId: 'form_max',
  });
  controller.init();

  view.element.querySelector('[name="summary"]').value = 'Too long';
  view.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

  expect(view.element.querySelector('#review-validation-error-summary').textContent).toContain('5');
});
