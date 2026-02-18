import { createReviewerAssignmentsView } from '../../src/views/reviewer-assignments-view.js';
import { createReviewerAssignmentsController } from '../../src/controllers/reviewer-assignments-controller.js';
import { assignmentStore } from '../../src/services/assignment-store.js';
import { sessionState } from '../../src/models/session-state.js';

beforeEach(() => {
  assignmentStore.reset();
  sessionState.clear();
  document.body.innerHTML = '';
});

test('list retrieval failure surfaces error state', () => {
  sessionState.authenticate({ id: 'acct_1', email: 'reviewer@example.com', role: 'Reviewer' });
  assignmentStore.setLookupFailureMode(true);
  const view = createReviewerAssignmentsView();
  document.body.appendChild(view.element);
  const controller = createReviewerAssignmentsController({ view, sessionState });
  controller.init();
  expect(view.element.querySelector('#assignments-banner').textContent).toContain('could not be loaded');
});
