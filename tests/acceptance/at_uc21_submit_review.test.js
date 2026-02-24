import { createReviewFormView } from '../../src/views/review-form-view.js';
import { createReviewSubmissionView } from '../../src/views/review-submission-view.js';
import { createReviewFormValidationView } from '../../src/views/review-form-validation-view.js';
import { createReviewFormErrorSummaryView } from '../../src/views/review-form-error-summary-view.js';
import { createReviewSubmissionController } from '../../src/controllers/review-submission-controller.js';
import { createEditorReviewListView } from '../../src/views/editor-review-list-view.js';
import { assignmentStore } from '../../src/services/assignment-store.js';
import { reviewFormStore } from '../../src/services/review-form-store.js';
import { reviewDraftStore } from '../../src/services/review-draft-store.js';
import { reviewSubmissionService } from '../../src/services/review-submission-service.js';
import { reviewDeliveryService } from '../../src/services/review-delivery-service.js';
import { authController } from '../../src/controllers/auth-controller.js';
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
  reviewDraftStore.reset();
  reviewSubmissionService.reset();
  reviewDeliveryService.reset();
  authController.clearPending();
  sessionState.clear();
  document.body.innerHTML = '';
});

test('AT-UC21-01: reviewer submits valid completed review successfully', () => {
  assignmentStore.addAssignment(createAssignment({ paperId: 'paper_1', reviewerEmail: 'rev@example.com', status: 'accepted' }));
  reviewFormStore.saveForm(createReviewForm({ paperId: 'paper_1', status: 'active', requiredFields: REQUIRED_REVIEW_FIELDS }));
  sessionState.authenticate({ id: 'acct_1', email: 'rev@example.com', role: 'Reviewer' });

  const { formView, submissionView } = setupSubmission({ paperId: 'paper_1' });
  fillForm(formView);

  formView.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  expect(submissionView.element.querySelector('#review-submission-banner').textContent).toContain('submitted');
});

test('AT-UC21-02: submitted review is visible to editor', () => {
  reviewDeliveryService.deliverReview({ reviewId: 'rev_1', editorId: 'editor_1' });
  const view = createEditorReviewListView();
  document.body.appendChild(view.element);

  const reviews = reviewDeliveryService.getEditorReviews('editor_1');
  view.setReviews(reviews);

  expect(view.element.querySelector('#editor-review-list').textContent).toContain('rev_1');
});

test('AT-UC21-03: validation failure prevents submission and shows errors', () => {
  assignmentStore.addAssignment(createAssignment({ paperId: 'paper_2', reviewerEmail: 'rev@example.com', status: 'accepted' }));
  reviewFormStore.saveForm(createReviewForm({ paperId: 'paper_2', status: 'active', requiredFields: REQUIRED_REVIEW_FIELDS }));
  sessionState.authenticate({ id: 'acct_2', email: 'rev@example.com', role: 'Reviewer' });

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
    paperId: 'paper_2',
  });
  controller.init();

  formView.element.querySelector('#review-confirm').checked = true;
  formView.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

  expect(submissionView.element.querySelector('#review-submission-banner').textContent).toContain('validation');
  expect(formView.element.querySelector('#review-form-error-summary').textContent).toContain('summary');
});

test('AT-UC21-04: review period closed blocks submission', () => {
  assignmentStore.addAssignment(createAssignment({ paperId: 'paper_3', reviewerEmail: 'rev@example.com', status: 'accepted' }));
  reviewFormStore.saveForm(createReviewForm({ paperId: 'paper_3', status: 'closed', requiredFields: REQUIRED_REVIEW_FIELDS }));
  sessionState.authenticate({ id: 'acct_3', email: 'rev@example.com', role: 'Reviewer' });

  const { formView, submissionView } = setupSubmission({ paperId: 'paper_3' });
  fillForm(formView);
  formView.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

  expect(formView.element.querySelector('#review-content').disabled).toBe(true);
  expect(submissionView.element.querySelector('#review-submission-banner').textContent).toContain('closed');
});

test('AT-UC21-05: session expired prompts login and allows retry', () => {
  assignmentStore.addAssignment(createAssignment({ paperId: 'paper_4', reviewerEmail: 'rev@example.com', status: 'accepted' }));
  reviewFormStore.saveForm(createReviewForm({ paperId: 'paper_4', status: 'active', requiredFields: REQUIRED_REVIEW_FIELDS }));

  const { formView, submissionView } = setupSubmission({ paperId: 'paper_4' });
  fillForm(formView);
  formView.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

  expect(submissionView.element.querySelector('#review-submission-banner').textContent).toContain('Session expired');
  expect(authController.getPending()).toEqual({ destination: 'review-submit', payload: { paperId: 'paper_4' } });
});

test('AT-UC21-06: DB write failure prevents submission but preserves content', () => {
  assignmentStore.addAssignment(createAssignment({ paperId: 'paper_5', reviewerEmail: 'rev@example.com', status: 'accepted' }));
  reviewFormStore.saveForm(createReviewForm({ paperId: 'paper_5', status: 'active', requiredFields: REQUIRED_REVIEW_FIELDS }));
  sessionState.authenticate({ id: 'acct_5', email: 'rev@example.com', role: 'Reviewer' });
  reviewSubmissionService.setSubmissionFailureMode(true);

  const { formView, submissionView } = setupSubmission({ paperId: 'paper_5' });
  fillForm(formView);
  formView.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

  expect(submissionView.element.querySelector('#review-submission-banner').textContent).toContain('failed');
  const draft = reviewDraftStore.getDraft('paper_5', 'rev@example.com');
  expect(draft).not.toBeNull();
});

test('AT-UC21-07: unauthorized reviewer cannot submit review for unassigned paper', () => {
  reviewFormStore.saveForm(createReviewForm({ paperId: 'paper_6', status: 'active', requiredFields: REQUIRED_REVIEW_FIELDS }));
  sessionState.authenticate({ id: 'acct_6', email: 'rev@example.com', role: 'Reviewer' });

  const { formView, submissionView } = setupSubmission({ paperId: 'paper_6' });
  fillForm(formView);
  formView.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

  expect(submissionView.element.querySelector('#review-submission-banner').textContent).toContain('not authorized');
});

test('AT-UC21-08: duplicate submission prevented when review already submitted', () => {
  assignmentStore.addAssignment(createAssignment({ paperId: 'paper_7', reviewerEmail: 'rev@example.com', status: 'accepted' }));
  reviewFormStore.saveForm(createReviewForm({ paperId: 'paper_7', status: 'active', requiredFields: REQUIRED_REVIEW_FIELDS }));
  sessionState.authenticate({ id: 'acct_7', email: 'rev@example.com', role: 'Reviewer' });

  const { formView, submissionView } = setupSubmission({ paperId: 'paper_7' });
  fillForm(formView);

  formView.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  formView.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

  expect(submissionView.element.querySelector('#review-submission-warning').textContent).toContain('already submitted');
});

test('AT-UC21-09: notification failure does not affect successful submission', () => {
  assignmentStore.addAssignment(createAssignment({ paperId: 'paper_8', reviewerEmail: 'rev@example.com', status: 'accepted' }));
  reviewFormStore.saveForm(createReviewForm({ paperId: 'paper_8', status: 'active', requiredFields: REQUIRED_REVIEW_FIELDS }));
  sessionState.authenticate({ id: 'acct_8', email: 'rev@example.com', role: 'Reviewer' });
  reviewSubmissionService.setNotificationFailureMode(true);

  const { formView, submissionView } = setupSubmission({ paperId: 'paper_8', notificationsEnabled: true });
  fillForm(formView);

  formView.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

  expect(submissionView.element.querySelector('#review-submission-warning').textContent).toContain('notification failed');
  expect(submissionView.element.querySelector('#review-submission-banner').textContent).toContain('submitted');
});
