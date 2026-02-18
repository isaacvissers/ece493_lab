import { createRefereeAssignmentView } from '../../src/views/referee-assignment-view.js';
import { createRefereeAssignmentController } from '../../src/controllers/referee-assignment-controller.js';
import { assignmentStorage } from '../../src/services/assignment-storage.js';
import { reviewRequestStore } from '../../src/services/review-request-store.js';
import { sessionState } from '../../src/models/session-state.js';

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
  reviewRequestStore.reset();
  sessionState.clear();
  document.body.innerHTML = '';
});

test('partial apply sends requests for valid entries', () => {
  assignmentStorage.seedPaper({ id: 'paper_5', title: 'Paper', status: 'Submitted' });
  sessionState.authenticate({ id: 'acct_5', email: 'editor@example.com', role: 'Editor', createdAt: new Date().toISOString() });
  const { view } = setup('paper_5');
  setEmails(view, ['valid@example.com', 'invalid-email', '']);
  submit(view);
  const summaryText = view.element.querySelector('#assignment-summary').textContent;
  expect(summaryText).toContain('Request sent: valid@example.com');
  expect(summaryText).toContain('Invalid reviewer email');
  expect(reviewRequestStore.getRequests()).toHaveLength(1);
});
