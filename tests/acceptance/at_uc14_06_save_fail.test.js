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

test('request save failure blocks assignments', () => {
  assignmentStorage.seedPaper({ id: 'paper_7', title: 'Paper', status: 'Submitted' });
  reviewRequestStore.setSaveFailureMode(true);
  sessionState.authenticate({ id: 'acct_6', email: 'editor@example.com', role: 'Editor', createdAt: new Date().toISOString() });
  const { view } = setup('paper_7');
  setEmails(view, ['a@example.com', 'b@example.com', 'c@example.com']);
  submit(view);
  expect(view.element.querySelector('#assignment-summary').textContent).toContain('Review request could not be delivered');
  expect(view.element.querySelector('#assignment-banner').textContent).toContain('No review requests were sent');
  reviewRequestStore.setSaveFailureMode(false);
});
