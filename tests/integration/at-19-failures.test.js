import { createRefereeAssignmentView } from '../../src/views/referee-assignment-view.js';
import { createRefereeAssignmentController } from '../../src/controllers/referee-assignment-controller.js';
import { createReviewerAssignmentsView } from '../../src/views/reviewer-assignments-view.js';
import { createReviewerAssignmentsController } from '../../src/controllers/reviewer-assignments-controller.js';
import { assignmentStore } from '../../src/services/assignment-store.js';
import { assignmentStorage } from '../../src/services/assignment-storage.js';
import { errorLog } from '../../src/services/error-log.js';
import { sessionState } from '../../src/models/session-state.js';
import { createAssignment } from '../../src/models/assignment.js';

function submit(view) {
  const event = new Event('submit', { bubbles: true, cancelable: true });
  view.element.querySelector('form').dispatchEvent(event);
}

beforeEach(() => {
  assignmentStore.reset();
  assignmentStorage.reset();
  errorLog.clear();
  sessionState.clear();
  document.body.innerHTML = '';
});

test('AT-UC19-05: count lookup failure blocks assignment and logs', () => {
  assignmentStorage.seedPaper({ id: 'paper_fail', title: 'Paper', status: 'Submitted' });
  assignmentStore.setLookupFailureMode(true);
  sessionState.authenticate({ id: 'acct_1', email: 'editor@example.com', role: 'Editor' });
  const view = createRefereeAssignmentView();
  document.body.appendChild(view.element);
  const controller = createRefereeAssignmentController({ view, assignmentStorage, sessionState, paperId: 'paper_fail' });
  controller.init();
  view.element.querySelector('#referee-email-1').value = 'a@example.com';
  submit(view);
  expect(view.element.querySelector('#assignment-banner').textContent).toContain('could not be determined');
  expect(errorLog.getFailures().length).toBeGreaterThan(0);
});

test('AT-UC19-06: alert UI failure uses fallback message', () => {
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
