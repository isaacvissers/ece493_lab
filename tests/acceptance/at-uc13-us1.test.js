import { createRefereeAssignmentView } from '../../src/views/referee-assignment-view.js';
import { createRefereeAssignmentController } from '../../src/controllers/referee-assignment-controller.js';
import { assignmentStorage } from '../../src/services/assignment-storage.js';
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
  assignmentErrorLog.clear();
  notificationService.clear();
  sessionState.clear();
  document.body.innerHTML = '';
});

test('happy path assigns referees and confirms', () => {
  assignmentStorage.seedPaper({ id: 'paper_1', title: 'Paper', status: 'Submitted' });
  sessionState.authenticate({ id: 'acct_1', email: 'editor@example.com', role: 'Editor', createdAt: new Date().toISOString() });
  const { view } = setup('paper_1');
  setEmails(view, ['a@example.com', 'b@example.com', 'c@example.com']);
  submit(view);
  expect(view.element.querySelector('#assignment-banner').textContent).toContain('paper_1');
});

test('notification failure shows warning while keeping assignments', () => {
  assignmentStorage.seedPaper({ id: 'paper_2', title: 'Paper', status: 'Submitted' });
  sessionState.authenticate({ id: 'acct_2', email: 'editor@example.com', role: 'Editor', createdAt: new Date().toISOString() });
  notificationService.setFailureMode(true);
  notificationService.setRetryFailureMode(true);
  const { view } = setup('paper_2');
  setEmails(view, ['a@example.com', 'b@example.com', 'c@example.com']);
  submit(view);
  expect(view.element.querySelector('#notification-warning').textContent).toContain('Notifications failed');
  const updated = assignmentStorage.getPaper('paper_2');
  expect(updated.assignedRefereeEmails).toHaveLength(3);
});
