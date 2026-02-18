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

test('single assignment sends request and accepts', () => {
  assignmentStorage.seedPaper({ id: 'paper_20', title: 'Paper', status: 'Submitted' });
  sessionState.authenticate({ id: 'acct_20', email: 'editor@example.com', role: 'Editor', createdAt: new Date().toISOString() });
  const { view } = setup('paper_20');
  setEmails(view, ['solo@example.com', '', '']);
  submit(view);
  expect(reviewRequestStore.getRequests()).toHaveLength(1);
  const request = reviewRequestStore.getRequests()[0];
  const response = reviewRequestService.respondToRequest(request.requestId, 'accept');
  expect(response.ok).toBe(true);
  expect(assignmentStore.getActiveCountForReviewer('solo@example.com')).toBe(1);
});
