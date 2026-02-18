import { invitationService } from '../../src/services/invitation-service.js';
import { assignmentStore } from '../../src/services/assignment-store.js';
import { invitationStore } from '../../src/services/invitation-store.js';
import { createReviewerResponseView } from '../../src/views/reviewer-response-view.js';
import { createReviewInvitationController } from '../../src/controllers/review-invitation-controller.js';

beforeEach(() => {
  invitationStore.reset();
  assignmentStore.reset();
  document.body.innerHTML = '';
});

test('reject response records assignment', () => {
  const sent = invitationService.sendInvitation({
    paperId: 'paper_3',
    reviewerEmail: 'reviewer@example.com',
    paperTitle: 'Paper Three',
  });
  const view = createReviewerResponseView();
  document.body.appendChild(view.element);
  const controller = createReviewInvitationController({
    view,
    invitationId: sent.invitation.invitationId,
    decision: 'reject',
  });
  controller.init();
  const assignment = assignmentStore.getAssignments()[0];
  expect(assignment.status).toBe('rejected');
  expect(view.element.querySelector('#response-banner').textContent).toContain('Response recorded');
});
