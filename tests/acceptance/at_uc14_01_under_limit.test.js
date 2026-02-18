import { createRefereeAssignmentView } from '../../src/views/referee-assignment-view.js';
import { createRefereeAssignmentController } from '../../src/controllers/referee-assignment-controller.js';
import { assignmentStorage } from '../../src/services/assignment-storage.js';
import { assignmentStore } from '../../src/services/assignment-store.js';
import { reviewRequestService } from '../../src/services/review-request-service.js';
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
  reviewRequestStore.reset();
  reviewRequestService.setDeliveryFailureMode(false);
  sessionState.clear();
  document.body.innerHTML = '';
});

test('under-limit assignment succeeds and reaches limit', () => {
  assignmentStorage.seedPaper({ id: 'paper_1', title: 'Paper', status: 'Submitted' });
  seedAssignments('limit@example.com', 4);
  sessionState.authenticate({ id: 'acct_1', email: 'editor@example.com', role: 'Editor', createdAt: new Date().toISOString() });
  const { view } = setup('paper_1');
  setEmails(view, ['limit@example.com', 'a@example.com', 'b@example.com']);
  submit(view);
  expect(view.element.querySelector('#assignment-summary').textContent).toContain('Request sent: limit@example.com');
  const request = reviewRequestStore.getRequests().find((entry) => entry.reviewerEmail === 'limit@example.com');
  reviewRequestService.respondToRequest(request.requestId, 'accept');
  expect(assignmentStore.getActiveCountForReviewer('limit@example.com')).toBe(5);
});
