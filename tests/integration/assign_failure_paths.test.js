import { createRefereeAssignmentView } from '../../src/views/referee-assignment-view.js';
import { createRefereeAssignmentController } from '../../src/controllers/referee-assignment-controller.js';
import { assignmentStorage } from '../../src/services/assignment-storage.js';
import { assignmentStore } from '../../src/services/assignment-store.js';
import { notificationService } from '../../src/services/notification-service.js';
import { assignmentErrorLog } from '../../src/services/assignment-error-log.js';
import { sessionState } from '../../src/models/session-state.js';

function setup(paperId) {
  const view = createRefereeAssignmentView();
  document.body.appendChild(view.element);
  const controller = createRefereeAssignmentController({
    view,
    assignmentStorage,
    notificationService,
    assignmentErrorLog,
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
  assignmentErrorLog.clear();
  notificationService.clear();
  sessionState.clear();
  document.body.innerHTML = '';
});

test('lookup failure blocks without saving paper', () => {
  assignmentStorage.seedPaper({ id: 'paper_12', title: 'Paper', status: 'Submitted' });
  assignmentStore.setLookupFailureMode(true);
  sessionState.authenticate({ id: 'acct_10', email: 'editor@example.com', role: 'Editor', createdAt: new Date().toISOString() });
  const { view } = setup('paper_12');
  setEmails(view, ['a@example.com', 'b@example.com', 'c@example.com']);
  submit(view);
  const updated = assignmentStorage.getPaper('paper_12');
  expect(updated.assignedRefereeEmails).toHaveLength(0);
  assignmentStore.setLookupFailureMode(false);
});

test('save failure blocks without persisting assignments', () => {
  assignmentStorage.seedPaper({ id: 'paper_13', title: 'Paper', status: 'Submitted' });
  assignmentStore.setSaveFailureMode(true);
  sessionState.authenticate({ id: 'acct_11', email: 'editor@example.com', role: 'Editor', createdAt: new Date().toISOString() });
  const { view } = setup('paper_13');
  setEmails(view, ['a@example.com', 'b@example.com', 'c@example.com']);
  submit(view);
  const updated = assignmentStorage.getPaper('paper_13');
  expect(updated.assignedRefereeEmails).toHaveLength(0);
  assignmentStore.setSaveFailureMode(false);
});
