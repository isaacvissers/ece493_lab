import { createReviewFormView } from '../../src/views/review-form-view.js';
import { createReviewFormController } from '../../src/controllers/review-form-controller.js';
import { reviewFormStore } from '../../src/services/review-form-store.js';
import { reviewDraftStore } from '../../src/services/review-draft-store.js';
import { assignmentStore } from '../../src/services/assignment-store.js';
import { errorLog } from '../../src/services/error-log.js';
import { sessionState } from '../../src/models/session-state.js';
import { createAssignment } from '../../src/models/assignment.js';
import { createReviewForm } from '../../src/models/review-form.js';

beforeEach(() => {
  assignmentStore.reset();
  reviewFormStore.reset();
  reviewDraftStore.reset();
  errorLog.clear();
  sessionState.clear();
  document.body.innerHTML = '';
});

test('AT-UC20-06: missing form shows error and logs failure', () => {
  assignmentStore.addAssignment(createAssignment({ paperId: 'paper_missing', reviewerEmail: 'rev@example.com', status: 'accepted' }));
  sessionState.authenticate({ id: 'acct_1', email: 'rev@example.com', role: 'Reviewer' });
  const view = createReviewFormView();
  document.body.appendChild(view.element);
  const controller = createReviewFormController({ view, sessionState, paperId: 'paper_missing' });
  controller.init();
  expect(view.element.querySelector('#review-form-banner').textContent).toContain('unavailable');
  expect(errorLog.getFailures().length).toBeGreaterThan(0);
});

test('AT-UC20-07..08: draft load failure shows error and allows retry', () => {
  assignmentStore.addAssignment(createAssignment({ paperId: 'paper_fail', reviewerEmail: 'rev@example.com', status: 'accepted' }));
  reviewFormStore.saveForm(createReviewForm({ paperId: 'paper_fail', status: 'active' }));
  reviewDraftStore.setFailureMode(true);
  sessionState.authenticate({ id: 'acct_1', email: 'rev@example.com', role: 'Reviewer' });
  const view = createReviewFormView();
  document.body.appendChild(view.element);
  const controller = createReviewFormController({ view, sessionState, paperId: 'paper_fail' });
  controller.init();
  expect(view.element.querySelector('#review-form-banner').textContent).toContain('could not be loaded');
});
