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

test('focuses error summary when validation fails', () => {
  assignmentStore.addAssignment(createAssignment({ paperId: 'paper_7', reviewerEmail: 'rev@example.com', status: 'accepted' }));
  reviewFormStore.saveForm(createReviewForm({ paperId: 'paper_7', status: 'active', requiredFields: REQUIRED_REVIEW_FIELDS }));
  sessionState.authenticate({ id: 'acct_7', email: 'rev@example.com', role: 'Reviewer' });

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
    paperId: 'paper_7',
  });
  controller.init();

  formView.element.querySelector('#review-confirm').checked = true;
  formView.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

  expect(document.activeElement.id).toBe('review-form-error-summary');
});
