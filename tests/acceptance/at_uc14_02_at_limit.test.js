import { createRefereeAssignmentView } from '../../src/views/referee-assignment-view.js';
import { createRefereeAssignmentController } from '../../src/controllers/referee-assignment-controller.js';
import { assignmentStorage } from '../../src/services/assignment-storage.js';
import { assignmentStore } from '../../src/services/assignment-store.js';
import { reviewRequestStore } from '../../src/services/review-request-store.js';
import { sessionState } from '../../src/models/session-state.js';
import { createAssignment } from '../../src/models/assignment.js';

function setup(paperId) {
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

function seedAssignments(email, count) {
  for (let i = 0; i < count; i += 1) {
    assignmentStore.addAssignment(createAssignment({ paperId: `paper_seed_${email}_${i}`, reviewerEmail: email }));
  }
}

function setEmails(view, emails) {
  emails.forEach((email, index) => {
    view.element.querySelector(`#referee-email-${index + 1}`).value = email;
  });
}

function submit(view) {
  const event = new Event('submit', { bubbles: true, cancelable: true });
  view.element.querySelector('form').dispatchEvent(event);
}

beforeEach(() => {
  assignmentStorage.reset();
  assignmentStore.reset();
  reviewRequestStore.reset();
  sessionState.clear();
  document.body.innerHTML = '';
});

test('at-limit reviewer is blocked with limit message', () => {
  assignmentStorage.seedPaper({ id: 'paper_2', title: 'Paper', status: 'Submitted' });
  seedAssignments('limit1@example.com', 5);
  seedAssignments('limit2@example.com', 5);
  seedAssignments('limit3@example.com', 5);
  sessionState.authenticate({ id: 'acct_2', email: 'editor@example.com', role: 'Editor', createdAt: new Date().toISOString() });
  const { view } = setup('paper_2');
  setEmails(view, ['limit1@example.com', 'limit2@example.com', 'limit3@example.com']);
  submit(view);
  expect(view.element.querySelector('#assignment-summary').textContent).toContain('maximum of 5 active assignments');
  expect(view.element.querySelector('#assignment-banner').textContent).toContain('No review requests were sent');
  expect(reviewRequestStore.getRequests()).toHaveLength(0);
  const updated = assignmentStorage.getPaper('paper_2');
  expect(updated.assignedRefereeEmails).toHaveLength(0);
});
