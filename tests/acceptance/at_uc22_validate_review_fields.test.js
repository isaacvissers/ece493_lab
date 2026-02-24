import { createReviewValidationView } from '../../src/views/review-validation-view.js';
import { createReviewErrorSummaryView } from '../../src/views/review-error-summary-view.js';
import { createReviewValidationController } from '../../src/controllers/review-validation-controller.js';
import { reviewFormStore } from '../../src/services/review-form-store.js';
import { reviewStorageService } from '../../src/services/review-storage-service.js';
import { errorLog } from '../../src/services/error-log.js';
import { createReviewForm } from '../../src/models/review-form.js';

function setup(formId) {
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

beforeEach(() => {
  reviewFormStore.reset();
  reviewStorageService.reset();
  errorLog.clear();
  document.body.innerHTML = '';
});

test('AT-UC22-01: valid inputs pass validation and submit succeeds', () => {
  reviewFormStore.saveForm(createReviewForm({
    paperId: 'form_1',
    requiredFields: ['summary', 'commentsToAuthors', 'recommendation', 'confidenceRating'],
    maxLengths: { summary: 2000, commentsToAuthors: 4000 },
  }));

  const view = setup('form_1');
  const form = view.element.querySelector('form');
  form.querySelector('[name="summary"]').value = 'Summary';
  form.querySelector('[name="commentsToAuthors"]').value = 'Comments';
  form.querySelector('[name="recommendation"]').value = 'accept';
  form.querySelector('[name="confidenceRating"]').value = '4';

  view.element.querySelector('#save-draft').click();
  expect(view.element.querySelector('#review-validation-banner').textContent).toContain('Draft saved');

  form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  expect(view.element.querySelector('#review-validation-banner').textContent).toContain('Review submitted');
});

test('AT-UC22-02: blank required field blocks submission and shows errors', () => {
  reviewFormStore.saveForm(createReviewForm({
    paperId: 'form_blank',
    requiredFields: ['summary'],
  }));

  const view = setup('form_blank');
  view.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

  expect(view.element.querySelector('#review-validation-error-summary').textContent).toContain('required');
  expect(view.element.querySelector('#review-validation-banner').textContent).toContain('correct');
});

test('AT-UC22-03: invalid characters block save/submit', () => {
  reviewFormStore.saveForm(createReviewForm({
    paperId: 'form_invalid',
    requiredFields: ['summary'],
  }));

  const view = setup('form_invalid');
  view.element.querySelector('[name="summary"]').value = 'Bad <script>';

  view.element.querySelector('#save-draft').click();
  expect(view.element.querySelector('#review-validation-error-summary').textContent).toContain('invalid characters');

  view.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  expect(view.element.querySelector('#review-validation-error-summary').textContent).toContain('invalid characters');
});

test('AT-UC22-04: multiple validation errors are shown together', () => {
  reviewFormStore.saveForm(createReviewForm({
    paperId: 'form_multi',
    requiredFields: ['summary', 'commentsToAuthors'],
  }));

  const view = setup('form_multi');
  view.element.querySelector('[name="summary"]').value = 'Bad <script>';
  view.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

  const summaryText = view.element.querySelector('#review-validation-error-summary').textContent;
  expect(summaryText).toContain('Summary');
  expect(summaryText).toContain('Comments');
});

test('AT-UC22-05: field length limit enforcement blocks action', () => {
  reviewFormStore.saveForm(createReviewForm({
    paperId: 'form_max',
    requiredFields: ['summary'],
    maxLengths: { summary: 5 },
  }));

  const view = setup('form_max');
  view.element.querySelector('[name="summary"]').value = 'Too long';
  view.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

  expect(view.element.querySelector('#review-validation-error-summary').textContent).toContain('5');
});

test('AT-UC22-06: DB write failure after validation shows error and logs', () => {
  reviewFormStore.saveForm(createReviewForm({
    paperId: 'form_storage',
    requiredFields: ['summary'],
  }));
  reviewStorageService.setFailureMode(true);

  const view = setup('form_storage');
  view.element.querySelector('[name="summary"]').value = 'Summary';
  view.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

  expect(view.element.querySelector('#review-validation-banner').textContent).toContain('could not save');
  expect(errorLog.getFailures().some((entry) => entry.errorType === 'review_storage_failure')).toBe(true);
});

test('AT-UC22-07: validation rules unavailable blocks action and logs', () => {
  const view = setup('missing_form');
  view.element.querySelector('#save-draft').click();

  expect(view.element.querySelector('#review-validation-banner').textContent).toContain('unavailable');
  expect(errorLog.getFailures().some((entry) => entry.errorType === 'validation_rules_unavailable')).toBe(true);
});
