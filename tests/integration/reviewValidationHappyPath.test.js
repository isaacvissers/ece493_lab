import { createReviewValidationView } from '../../src/views/review-validation-view.js';
import { createReviewErrorSummaryView } from '../../src/views/review-error-summary-view.js';
import { createReviewValidationController } from '../../src/controllers/review-validation-controller.js';
import { reviewFormStore } from '../../src/services/review-form-store.js';
import { reviewStorageService } from '../../src/services/review-storage-service.js';
import { createReviewForm } from '../../src/models/review-form.js';

function setup(formId) {
  reviewFormStore.saveForm(createReviewForm({
    paperId: formId,
    requiredFields: ['summary', 'commentsToAuthors', 'recommendation', 'confidenceRating'],
    maxLengths: { summary: 2000, commentsToAuthors: 4000 },
  }));

  const view = createReviewValidationView();
  const summaryView = createReviewErrorSummaryView(view.element);
  document.body.appendChild(view.element);

  const controller = createReviewValidationController({
    view,
    summaryView,
    formId,
    reviewerEmail: 'rev@example.com',
  });
  controller.init();
  return view;
}

function fillValid(view) {
  const form = view.element.querySelector('form');
  form.querySelector('[name="summary"]').value = 'Summary';
  form.querySelector('[name="commentsToAuthors"]').value = 'Comments';
  form.querySelector('[name="recommendation"]').value = 'accept';
  form.querySelector('[name="confidenceRating"]').value = '4';
}

beforeEach(() => {
  reviewFormStore.reset();
  reviewStorageService.reset();
  document.body.innerHTML = '';
});

test('valid inputs save draft and submit successfully', () => {
  const view = setup('form_1');
  fillValid(view);

  view.element.querySelector('#save-draft').click();
  expect(view.element.querySelector('#review-validation-banner').textContent).toContain('Draft saved');

  const form = view.element.querySelector('form');
  form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  expect(view.element.querySelector('#review-validation-banner').textContent).toContain('Review submitted');
});
