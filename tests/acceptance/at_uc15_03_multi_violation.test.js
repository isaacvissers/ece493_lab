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

test('reports multiple violations in one submission', () => {
  assignmentStorage.seedPaper({ id: 'paper_4', title: 'Paper', status: 'Submitted' });
  for (let i = 0; i < 5; i += 1) {
    assignmentStore.addAssignment(createAssignment({ paperId: `seed_${i}`, reviewerEmail: 'limit@example.com' }));
  }
  sessionState.authenticate({ id: 'acct_4', email: 'editor@example.com', role: 'Editor', createdAt: new Date().toISOString() });
  const { view } = setup('paper_4');
  setEmails(view, ['invalid-email', 'limit@example.com', 'ok@example.com']);
  submit(view);
  const summaryText = view.element.querySelector('#assignment-summary').textContent;
  expect(summaryText).toContain('Invalid reviewer email');
  expect(summaryText).toContain('maximum of 5 active assignments');
  expect(summaryText).toContain('Request sent: ok@example.com');
});
