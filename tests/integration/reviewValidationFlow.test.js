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

beforeEach(() => {
  assignmentStore.reset();
  reviewFormStore.reset();
  reviewSubmissionService.reset();
  sessionState.clear();
  document.body.innerHTML = '';
});

test('blocks submission with validation errors', () => {
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
