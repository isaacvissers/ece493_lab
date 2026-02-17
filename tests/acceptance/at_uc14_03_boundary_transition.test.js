import { createRefereeAssignmentView } from '../../src/views/referee-assignment-view.js';
import { createRefereeAssignmentController } from '../../src/controllers/referee-assignment-controller.js';
import { assignmentStorage } from '../../src/services/assignment-storage.js';
import { assignmentStore } from '../../src/services/assignment-store.js';
import { notificationService } from '../../src/services/notification-service.js';
import { assignmentErrorLog } from '../../src/services/assignment-error-log.js';
import { sessionState } from '../../src/models/session-state.js';
import { createAssignment } from '../../src/models/assignment.js';

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

function seedAssignments(email, count) {
  for (let i = 0; i < count; i += 1) {
    assignmentStore.addAssignment(createAssignment({ paperId: `paper_seed_${i}`, reviewerEmail: email }));
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
  assignmentErrorLog.clear();
  notificationService.clear();
  sessionState.clear();
  document.body.innerHTML = '';
});

test('boundary transition 4 to 5 then deny', () => {
  assignmentStorage.seedPaper({ id: 'paper_3', title: 'Paper', status: 'Submitted' });
  assignmentStorage.seedPaper({ id: 'paper_4', title: 'Paper', status: 'Submitted' });
  seedAssignments('limit@example.com', 4);
  sessionState.authenticate({ id: 'acct_3', email: 'editor@example.com', role: 'Editor', createdAt: new Date().toISOString() });

  const first = setup('paper_3');
  setEmails(first.view, ['limit@example.com', 'a@example.com', 'b@example.com']);
  submit(first.view);
  expect(assignmentStore.getActiveCountForReviewer('limit@example.com')).toBe(5);

  document.body.innerHTML = '';
  const second = setup('paper_4');
  setEmails(second.view, ['limit@example.com', 'c@example.com', 'd@example.com']);
  submit(second.view);
  expect(assignmentStore.getActiveCountForReviewer('limit@example.com')).toBe(5);
  expect(second.view.element.querySelector('#assignment-summary').textContent).toContain('maximum of 5 active assignments');
});
