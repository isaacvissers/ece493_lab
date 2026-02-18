import { createRefereeAssignmentView } from '../../src/views/referee-assignment-view.js';
import { createRefereeAssignmentController } from '../../src/controllers/referee-assignment-controller.js';
import { assignmentStore } from '../../src/services/assignment-store.js';
import { assignmentStorage } from '../../src/services/assignment-storage.js';
import { sessionState } from '../../src/models/session-state.js';
import { createAssignment } from '../../src/models/assignment.js';

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

test('batch assignment partially applies and blocks overage', () => {
  assignmentStorage.seedPaper({ id: 'paper_batch', title: 'Paper', status: 'Submitted' });
  assignmentStore.addAssignment(createAssignment({ paperId: 'paper_batch', reviewerEmail: 'a@example.com', status: 'accepted' }));
  assignmentStore.addAssignment(createAssignment({ paperId: 'paper_batch', reviewerEmail: 'b@example.com', status: 'accepted' }));
  sessionState.authenticate({ id: 'acct_1', email: 'editor@example.com', role: 'Editor' });

  const view = createRefereeAssignmentView();
  document.body.appendChild(view.element);
  const controller = createRefereeAssignmentController({ view, assignmentStorage, sessionState, paperId: 'paper_batch' });
  controller.init();

  setEmails(view, ['c@example.com', 'd@example.com', 'e@example.com']);
  submit(view);

  expect(view.element.querySelector('#assignment-summary').textContent).toContain('Blocked');
});
