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

test('bulk assignment applies partial results', () => {
  assignmentStorage.seedPaper({ id: 'paper_11', title: 'Paper', status: 'Submitted' });
  seedAssignments('limit@example.com', 5);
  sessionState.authenticate({ id: 'acct_9', email: 'editor@example.com', role: 'Editor', createdAt: new Date().toISOString() });
  const { view } = setup('paper_11');
  setEmails(view, ['limit@example.com', 'ok1@example.com', 'ok2@example.com']);
  submit(view);
  const updated = assignmentStorage.getPaper('paper_11');
  expect(updated.assignedRefereeEmails).toEqual(['ok1@example.com', 'ok2@example.com']);
  expect(view.element.querySelector('#assignment-summary').textContent).toContain('Rejected: limit@example.com');
});
