import { createReviewerResponseView } from '../../src/views/reviewer-response-view.js';
import { createReviewInvitationController } from '../../src/controllers/review-invitation-controller.js';
import { invitationStore } from '../../src/services/invitation-store.js';
import { assignmentStore } from '../../src/services/assignment-store.js';

beforeEach(() => {
  invitationStore.reset();
  assignmentStore.reset();
  document.body.innerHTML = '';
});

test('invalid link shows error and no response recorded', () => {
  const view = createReviewerResponseView();
  document.body.appendChild(view.element);
  const controller = createReviewInvitationController({
    view,
    invitationId: 'missing',
    decision: 'accept',
  });
  controller.init();
  expect(view.element.querySelector('#response-banner').textContent).toContain('invalid or expired');
  expect(assignmentStore.getAssignments()).toHaveLength(0);
});
