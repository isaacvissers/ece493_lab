import { createRefereeAssignmentView } from '../../src/views/referee-assignment-view.js';
import { createRefereeAssignmentController } from '../../src/controllers/referee-assignment-controller.js';
import { assignmentStorage } from '../../src/services/assignment-storage.js';
import { assignmentStore } from '../../src/services/assignment-store.js';
import { reviewRequestService } from '../../src/services/review-request-service.js';
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
  assignmentStore.reset();
  reviewRequestStore.reset();
  reviewRequestService.setDeliveryFailureMode(false);
  sessionState.clear();
  document.body.innerHTML = '';
});

test('accept creates assignment and reject leaves it unassigned', () => {
  assignmentStorage.seedPaper({ id: 'paper_3', title: 'Paper', status: 'Submitted' });
  sessionState.authenticate({ id: 'acct_3', email: 'editor@example.com', role: 'Editor', createdAt: new Date().toISOString() });
  const { view } = setup('paper_3');
  setEmails(view, ['accept@example.com', 'reject@example.com', '']);
  submit(view);

  const requests = reviewRequestStore.getRequests();
  const acceptRequest = requests.find((entry) => entry.reviewerEmail === 'accept@example.com');
  const rejectRequest = requests.find((entry) => entry.reviewerEmail === 'reject@example.com');

  reviewRequestService.respondToRequest(acceptRequest.requestId, 'accept');
  reviewRequestService.respondToRequest(rejectRequest.requestId, 'reject');

  const updated = assignmentStorage.getPaper('paper_3');
  expect(updated.assignedRefereeEmails).toContain('accept@example.com');
  expect(updated.assignedRefereeEmails).not.toContain('reject@example.com');
  expect(assignmentStore.getActiveCountForReviewer('accept@example.com')).toBe(1);
  expect(assignmentStore.getActiveCountForReviewer('reject@example.com')).toBe(0);
});
