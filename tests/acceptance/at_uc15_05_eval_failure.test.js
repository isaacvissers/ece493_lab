import { createRefereeAssignmentView } from '../../src/views/referee-assignment-view.js';
import { createRefereeAssignmentController } from '../../src/controllers/referee-assignment-controller.js';
import { assignmentStorage } from '../../src/services/assignment-storage.js';
import { assignmentStore } from '../../src/services/assignment-store.js';
import { violationLog } from '../../src/services/violation-log.js';
import { sessionState } from '../../src/models/session-state.js';

function setup(paperId) {
  const view = createRefereeAssignmentView();
  document.body.appendChild(view.element);
  const controller = createRefereeAssignmentController({
    view,
    assignmentStorage,
    sessionState,
    paperId,
    violationLog,
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
  violationLog.clear();
  sessionState.clear();
  document.body.innerHTML = '';
});

test('evaluation failure blocks assignments', () => {
  assignmentStorage.seedPaper({ id: 'paper_6', title: 'Paper', status: 'Submitted' });
  assignmentStore.setLookupFailureMode(true);
  sessionState.authenticate({ id: 'acct_6', email: 'editor@example.com', role: 'Editor', createdAt: new Date().toISOString() });
  const { view } = setup('paper_6');
  setEmails(view, ['a@example.com', '', '']);
  submit(view);
  expect(view.element.querySelector('#assignment-banner').textContent).toContain('Assignments cannot be completed');
  expect(violationLog.getFailures()).toHaveLength(1);
  assignmentStore.setLookupFailureMode(false);
});
