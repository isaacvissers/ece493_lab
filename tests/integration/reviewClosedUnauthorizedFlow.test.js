import { createReviewFormView } from '../../src/views/review-form-view.js';
import { createReviewSubmissionView } from '../../src/views/review-submission-view.js';
import { createReviewFormValidationView } from '../../src/views/review-form-validation-view.js';
import { createReviewFormErrorSummaryView } from '../../src/views/review-form-error-summary-view.js';
import { createReviewSubmissionController } from '../../src/controllers/review-submission-controller.js';
import { assignmentStore } from '../../src/services/assignment-store.js';
import { reviewFormStore } from '../../src/services/review-form-store.js';
import { reviewSubmissionService } from '../../src/services/review-submission-service.js';
import { sessionState } from '../../src/models/session-state.js';
import { createAssignment } from '../../src/models/assignment.js';
import { createReviewForm } from '../../src/models/review-form.js';
import { REQUIRED_REVIEW_FIELDS } from '../../src/models/review-constants.js';

function setupViews() {
  const formView = createReviewFormView();
  const submissionView = createReviewSubmissionView();
  const validationView = createReviewFormValidationView(formView.element.querySelector('form'));
  const errorSummaryView = createReviewFormErrorSummaryView(formView.element);
  document.body.appendChild(formView.element);
  document.body.appendChild(submissionView.element);
  return { formView, submissionView, validationView, errorSummaryView };
}

function fillForm(formView) {
  const form = formView.element.querySelector('form');
  form.querySelector('[name="summary"]').value = 'Summary';
  form.querySelector('[name="commentsToAuthors"]').value = 'Comments';
  form.querySelector('[name="recommendation"]').value = 'accept';
  form.querySelector('[name="confidenceRating"]').value = '4';
  form.querySelector('#review-confirm').checked = true;
}

beforeEach(() => {
  assignmentStore.reset();
  reviewFormStore.reset();
  reviewSubmissionService.reset();
  sessionState.clear();
  document.body.innerHTML = '';
});

test('closed review period switches to view-only', () => {
  assignmentStore.addAssignment(createAssignment({ paperId: 'paper_3', reviewerEmail: 'rev@example.com', status: 'accepted' }));
  reviewFormStore.saveForm(createReviewForm({ paperId: 'paper_3', status: 'closed', requiredFields: REQUIRED_REVIEW_FIELDS }));
  sessionState.authenticate({ id: 'acct_3', email: 'rev@example.com', role: 'Reviewer' });

  const { formView, submissionView, validationView, errorSummaryView } = setupViews();
  const controller = createReviewSubmissionController({
    formView,
    submissionView,
    validationView,
    errorSummaryView,
    sessionState,
    paperId: 'paper_3',
  });
  controller.init();

  fillForm(formView);
  formView.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

  expect(formView.element.querySelector('#review-content').disabled).toBe(true);
  expect(submissionView.element.querySelector('#review-submission-banner').textContent).toContain('closed');
});

test('unauthorized submission shows guidance', () => {
  reviewFormStore.saveForm(createReviewForm({ paperId: 'paper_4', status: 'active', requiredFields: REQUIRED_REVIEW_FIELDS }));
  sessionState.authenticate({ id: 'acct_4', email: 'rev@example.com', role: 'Reviewer' });

  const { formView, submissionView, validationView, errorSummaryView } = setupViews();
  const controller = createReviewSubmissionController({
    formView,
    submissionView,
    validationView,
    errorSummaryView,
    sessionState,
    paperId: 'paper_4',
  });
  controller.init();

  fillForm(formView);
  formView.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

  expect(submissionView.element.querySelector('#review-submission-banner').textContent).toContain('not authorized');
});
