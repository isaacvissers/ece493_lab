import { invitationService } from '../../src/services/invitation-service.js';
import { invitationStore } from '../../src/services/invitation-store.js';
import { assignmentStore } from '../../src/services/assignment-store.js';
import { createReviewerResponseView } from '../../src/views/reviewer-response-view.js';
import { createReviewInvitationController } from '../../src/controllers/review-invitation-controller.js';

beforeEach(() => {
  invitationStore.reset();
  assignmentStore.reset();
  document.body.innerHTML = '';
});

test('respond flow updates invitation and assignment', () => {
  const sent = invitationService.sendInvitation({
    paperId: 'paper_10',
    reviewerEmail: 'reviewer@example.com',
    paperTitle: 'Paper Ten',
  });
  const view = createReviewerResponseView();
  document.body.appendChild(view.element);
  const controller = createReviewInvitationController({
    view,
    invitationId: sent.invitation.invitationId,
    decision: 'accept',
  });
  controller.init();
  const invitation = invitationStore.getInvitation(sent.invitation.invitationId);
  expect(invitation.status).toBe('accepted');
  expect(assignmentStore.getAssignments()).toHaveLength(1);
});
