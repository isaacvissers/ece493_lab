import { createReviewFormView } from '../../src/views/review-form-view.js';
import { createReviewSubmissionView } from '../../src/views/review-submission-view.js';
import { createReviewFormValidationView } from '../../src/views/review-form-validation-view.js';
import { createReviewFormErrorSummaryView } from '../../src/views/review-form-error-summary-view.js';
import { createReviewSubmissionController } from '../../src/controllers/review-submission-controller.js';
import { assignmentStore } from '../../src/services/assignment-store.js';
import { reviewFormStore } from '../../src/services/review-form-store.js';
import { reviewDraftStore } from '../../src/services/review-draft-store.js';
import { reviewSubmissionService } from '../../src/services/review-submission-service.js';
import { sessionState } from '../../src/models/session-state.js';
import { createAssignment } from '../../src/models/assignment.js';
import { createReviewForm } from '../../src/models/review-form.js';
import { REQUIRED_REVIEW_FIELDS } from '../../src/models/review-constants.js';

beforeEach(() => {
  assignmentStore.reset();
  reviewFormStore.reset();
  reviewDraftStore.reset();
  reviewSubmissionService.reset();
  sessionState.clear();
  document.body.innerHTML = '';
});

test('submission failure preserves draft', () => {
  assignmentStore.addAssignment(createAssignment({ paperId: 'paper_5', reviewerEmail: 'rev@example.com', status: 'accepted' }));
  reviewFormStore.saveForm(createReviewForm({ paperId: 'paper_5', status: 'active', requiredFields: REQUIRED_REVIEW_FIELDS }));
  sessionState.authenticate({ id: 'acct_5', email: 'rev@example.com', role: 'Reviewer' });
  reviewSubmissionService.setSubmissionFailureMode(true);

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
    paperId: 'paper_5',
  });
  controller.init();

  const form = formView.element.querySelector('form');
  form.querySelector('[name="summary"]').value = 'Summary';
  form.querySelector('[name="commentsToAuthors"]').value = 'Comments';
  form.querySelector('[name="recommendation"]').value = 'accept';
  form.querySelector('[name="confidenceRating"]').value = '4';
  form.querySelector('#review-confirm').checked = true;
  form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

  expect(submissionView.element.querySelector('#review-submission-banner').textContent).toContain('failed');
  const draft = reviewDraftStore.getDraft('paper_5', 'rev@example.com');
  expect(draft).not.toBeNull();
});
