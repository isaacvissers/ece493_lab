import { createReviewerAssignmentsView } from '../../src/views/reviewer-assignments-view.js';
import { createReviewerAssignmentsController } from '../../src/controllers/reviewer-assignments-controller.js';
import { assignmentStore } from '../../src/services/assignment-store.js';
import { sessionState } from '../../src/models/session-state.js';
import { createAssignment } from '../../src/models/assignment.js';

beforeEach(() => {
  assignmentStore.reset();
  sessionState.clear();
  document.body.innerHTML = '';
});

test('alert fallback renders when alert UI fails', () => {
  assignmentStore.addAssignment(createAssignment({ paperId: 'paper_alert', reviewerEmail: 'a@example.com', status: 'accepted' }));
  assignmentStore.addAssignment(createAssignment({ paperId: 'paper_alert', reviewerEmail: 'b@example.com', status: 'accepted' }));
  assignmentStore.addAssignment(createAssignment({ paperId: 'paper_alert', reviewerEmail: 'c@example.com', status: 'accepted' }));
  assignmentStore.addAssignment(createAssignment({ paperId: 'paper_alert', reviewerEmail: 'd@example.com', status: 'accepted' }));
  assignmentStore.addAssignment(createAssignment({ paperId: 'paper_alert', reviewerEmail: 'reviewer@example.com', status: 'accepted' }));
  sessionState.authenticate({ id: 'acct_2', email: 'reviewer@example.com', role: 'Reviewer' });
  const view = createReviewerAssignmentsView();
  view.setAlertFailureMode(true);
  document.body.appendChild(view.element);
  const controller = createReviewerAssignmentsController({ view, sessionState });
  controller.init();
  expect(view.element.querySelector('#overassignment-alert-fallback').textContent).toContain('Over-assignment');
});
