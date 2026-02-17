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

test('blank emails block assignment', () => {
  assignmentStorage.seedPaper({ id: 'paper_1', title: 'Paper', status: 'Submitted' });
  sessionState.authenticate({ id: 'acct_1', email: 'editor@example.com', role: 'Editor', createdAt: new Date().toISOString() });
  const { view } = setup('paper_1');
  setEmails(view, ['', 'b@example.com', 'c@example.com']);
  submit(view);
  expect(view.element.querySelector('#referee-email-1-error').textContent).toContain('required');
});

test('invalid emails block assignment', () => {
  assignmentStorage.seedPaper({ id: 'paper_2', title: 'Paper', status: 'Submitted' });
  sessionState.authenticate({ id: 'acct_2', email: 'editor@example.com', role: 'Editor', createdAt: new Date().toISOString() });
  const { view } = setup('paper_2');
  setEmails(view, ['invalid', 'b@example.com', 'c@example.com']);
  submit(view);
  expect(view.element.querySelector('#referee-email-1-error').textContent).toContain('invalid');
});

test('duplicate emails are rejected', () => {
  assignmentStorage.seedPaper({ id: 'paper_3', title: 'Paper', status: 'Submitted' });
  sessionState.authenticate({ id: 'acct_3', email: 'editor@example.com', role: 'Editor', createdAt: new Date().toISOString() });
  const { view } = setup('paper_3');
  setEmails(view, ['dup@example.com', 'dup@example.com', 'c@example.com']);
  submit(view);
  expect(view.element.querySelector('#referee-email-2-error').textContent).toContain('Duplicate');
  expect(view.element.querySelector('#referee-count-error').textContent).toContain('Exactly 3');
});
