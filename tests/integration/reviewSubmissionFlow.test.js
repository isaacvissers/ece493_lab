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

function setupSubmission({ paperId, notificationsEnabled = false } = {}) {
  const formView = createReviewFormView();
  const submissionView = createReviewSubmissionView();
  const validationView = createReviewFormValidationView(formView.element.querySelector('form'));
  const errorSummaryView = createReviewFormErrorSummaryView(formView.element);

  document.body.appendChild(formView.element);
  document.body.appendChild(submissionView.element);

  const controller = createReviewSubmissionController({
    formView,
    submissionView,
    validationView,
    errorSummaryView,
    sessionState,
    paperId,
    notificationsEnabled,
  });
  controller.init();
  return { formView, submissionView };
}

function fillForm(formView, overrides = {}) {
  const values = {
    summary: 'Summary',
    commentsToAuthors: 'Comments',
    recommendation: 'accept',
    confidenceRating: '4',
    ...overrides,
  };
  const form = formView.element.querySelector('form');
  form.querySelector('[name="summary"]').value = values.summary;
  form.querySelector('[name="commentsToAuthors"]').value = values.commentsToAuthors;
  form.querySelector('[name="recommendation"]').value = values.recommendation;
  form.querySelector('[name="confidenceRating"]').value = values.confidenceRating;
  form.querySelector('#review-confirm').checked = true;
}

beforeEach(() => {
  assignmentStore.reset();
  reviewFormStore.reset();
  reviewSubmissionService.reset();
  sessionState.clear();
  document.body.innerHTML = '';
});

test('submits review and blocks duplicates', () => {
  assignmentStore.addAssignment(createAssignment({ paperId: 'paper_1', reviewerEmail: 'rev@example.com', status: 'accepted' }));
  reviewFormStore.saveForm(createReviewForm({ paperId: 'paper_1', status: 'active', requiredFields: REQUIRED_REVIEW_FIELDS }));
  sessionState.authenticate({ id: 'acct_1', email: 'rev@example.com', role: 'Reviewer' });

  const { formView, submissionView } = setupSubmission({ paperId: 'paper_1' });
  fillForm(formView);

  formView.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  expect(submissionView.element.querySelector('#review-submission-banner').textContent).toContain('submitted');

  formView.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  expect(submissionView.element.querySelector('#review-submission-warning').textContent).toContain('already submitted');
});
