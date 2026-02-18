import { createRefereeAssignmentView } from '../../src/views/referee-assignment-view.js';
import { createRefereeAssignmentController } from '../../src/controllers/referee-assignment-controller.js';
import { createReviewerAssignmentsView } from '../../src/views/reviewer-assignments-view.js';
import { createReviewerAssignmentsController } from '../../src/controllers/reviewer-assignments-controller.js';
import { assignmentStore } from '../../src/services/assignment-store.js';
import { assignmentStorage } from '../../src/services/assignment-storage.js';
import { sessionState } from '../../src/models/session-state.js';
import { createAssignment } from '../../src/models/assignment.js';

function setupEditorAssignment(paperId) {
  const view = createRefereeAssignmentView();
  document.body.appendChild(view.element);
  const controller = createRefereeAssignmentController({
    view,
    assignmentStorage,
    sessionState,
    paperId,
  });
  controller.init();
  return { view };
}

function setupReviewerAssignments() {
  const view = createReviewerAssignmentsView();
  document.body.appendChild(view.element);
  const controller = createReviewerAssignmentsController({
    view,
    sessionState,
  });
  controller.init();
  return { view };
}

function setEmails(view, emails) {
  emails.forEach((email, index) => {
    const input = view.element.querySelector(`#referee-email-${index + 1}`);
    if (input) {
      input.value = email;
    }
  });
}

function submit(view) {
  const event = new Event('submit', { bubbles: true, cancelable: true });
  view.element.querySelector('form').dispatchEvent(event);
}

beforeEach(() => {
  assignmentStore.reset();
  assignmentStorage.reset();
  sessionState.clear();
  document.body.innerHTML = '';
});

test('AT-UC19-01: block adding a 4th reviewer with alert and guidance', () => {
  assignmentStorage.seedPaper({ id: 'paper_1', title: 'Paper', status: 'Submitted' });
  assignmentStore.addAssignment(createAssignment({ paperId: 'paper_1', reviewerEmail: 'a@example.com', status: 'accepted' }));
  assignmentStore.addAssignment(createAssignment({ paperId: 'paper_1', reviewerEmail: 'b@example.com', status: 'accepted' }));
  assignmentStore.addAssignment(createAssignment({ paperId: 'paper_1', reviewerEmail: 'c@example.com', status: 'accepted' }));
  sessionState.authenticate({ id: 'acct_1', email: 'editor@example.com', role: 'Editor' });
  const { view } = setupEditorAssignment('paper_1');
  setEmails(view, ['d@example.com']);
  submit(view);
  expect(view.element.querySelector('#notification-warning').textContent).toContain('Over-assignment');
  expect(view.element.querySelector('#assignment-summary').textContent).toContain('Blocked');
});

test('AT-UC19-02: alert on view when already over-assigned', () => {
  assignmentStore.addAssignment(createAssignment({ paperId: 'paper_2', reviewerEmail: 'a@example.com', status: 'accepted' }));
  assignmentStore.addAssignment(createAssignment({ paperId: 'paper_2', reviewerEmail: 'b@example.com', status: 'accepted' }));
  assignmentStore.addAssignment(createAssignment({ paperId: 'paper_2', reviewerEmail: 'c@example.com', status: 'accepted' }));
  assignmentStore.addAssignment(createAssignment({ paperId: 'paper_2', reviewerEmail: 'd@example.com', status: 'accepted' }));
  assignmentStore.addAssignment(createAssignment({ paperId: 'paper_2', reviewerEmail: 'reviewer@example.com', status: 'accepted' }));
  sessionState.authenticate({ id: 'acct_2', email: 'reviewer@example.com', role: 'Reviewer' });
  const { view } = setupReviewerAssignments();
  expect(view.element.querySelector('#overassignment-alert').textContent).toContain('Over-assignment');
});

test('AT-UC19-03: batch applies up to three and blocks extras', () => {
  assignmentStorage.seedPaper({ id: 'paper_3', title: 'Paper', status: 'Submitted' });
  assignmentStore.addAssignment(createAssignment({ paperId: 'paper_3', reviewerEmail: 'a@example.com', status: 'accepted' }));
  assignmentStore.addAssignment(createAssignment({ paperId: 'paper_3', reviewerEmail: 'b@example.com', status: 'accepted' }));
  sessionState.authenticate({ id: 'acct_1', email: 'editor@example.com', role: 'Editor' });
  const { view } = setupEditorAssignment('paper_3');
  setEmails(view, ['c@example.com', 'd@example.com', 'e@example.com']);
  submit(view);
  expect(view.element.querySelector('#assignment-summary').textContent).toContain('Blocked');
});

test('AT-UC19-04: batch exact three confirms without alert', () => {
  assignmentStorage.seedPaper({ id: 'paper_4', title: 'Paper', status: 'Submitted' });
  assignmentStore.addAssignment(createAssignment({ paperId: 'paper_4', reviewerEmail: 'a@example.com', status: 'accepted' }));
  sessionState.authenticate({ id: 'acct_1', email: 'editor@example.com', role: 'Editor' });
  const { view } = setupEditorAssignment('paper_4');
  setEmails(view, ['b@example.com', 'c@example.com']);
  submit(view);
  expect(view.element.querySelector('#notification-warning').textContent).toBe('');
});
