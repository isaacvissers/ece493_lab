import { createReviewerAssignmentsView } from '../../src/views/reviewer-assignments-view.js';
import { createReviewerAssignmentsController } from '../../src/controllers/reviewer-assignments-controller.js';
import { assignmentStore } from '../../src/services/assignment-store.js';
import { assignmentStorage } from '../../src/services/assignment-storage.js';
import { submissionStorage } from '../../src/services/submission-storage.js';
import { sessionState } from '../../src/models/session-state.js';

beforeEach(() => {
  assignmentStore.reset();
  assignmentStorage.reset();
  submissionStorage.reset();
  sessionState.clear();
  document.body.innerHTML = '';
});

test('assignment list retrieval completes within 2 seconds', () => {
  sessionState.authenticate({ id: 'acct_1', email: 'reviewer@example.com', role: 'Reviewer' });
  const view = createReviewerAssignmentsView();
  document.body.appendChild(view.element);
  const controller = createReviewerAssignmentsController({ view, sessionState });
  const start = Date.now();
  controller.init();
  const duration = Date.now() - start;
  expect(duration).toBeLessThan(2000);
});
