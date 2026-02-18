import { createReviewFormView } from '../../src/views/review-form-view.js';
import { createReviewFormController } from '../../src/controllers/review-form-controller.js';
import { assignmentStore } from '../../src/services/assignment-store.js';
import { errorLog } from '../../src/services/error-log.js';
import { sessionState } from '../../src/models/session-state.js';
import { createAssignment } from '../../src/models/assignment.js';

beforeEach(() => {
  assignmentStore.reset();
  errorLog.clear();
  sessionState.clear();
  document.body.innerHTML = '';
});

test('form missing error surfaces and logs', () => {
  assignmentStore.addAssignment(createAssignment({ paperId: 'paper_missing', reviewerEmail: 'rev@example.com', status: 'accepted' }));
  sessionState.authenticate({ id: 'acct_1', email: 'rev@example.com', role: 'Reviewer' });
  const view = createReviewFormView();
  document.body.appendChild(view.element);
  const controller = createReviewFormController({ view, sessionState, paperId: 'paper_missing' });
  controller.init();
  expect(view.element.querySelector('#review-form-banner').textContent).toContain('unavailable');
  expect(errorLog.getFailures().length).toBeGreaterThan(0);
});
