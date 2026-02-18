import { invitationService } from '../../src/services/invitation-service.js';
import { invitationStore } from '../../src/services/invitation-store.js';
import { invitationLog } from '../../src/services/invitation-log.js';
import { assignmentStore } from '../../src/services/assignment-store.js';
import { createReviewerResponseView } from '../../src/views/reviewer-response-view.js';
import { createReviewInvitationController } from '../../src/controllers/review-invitation-controller.js';

beforeEach(() => {
  invitationStore.reset();
  invitationLog.clear();
  assignmentStore.reset();
  document.body.innerHTML = '';
});

test('record failure logs and leaves assignment unchanged', () => {
  const sent = invitationService.sendInvitation({
    paperId: 'paper_6',
    reviewerEmail: 'reviewer@example.com',
    paperTitle: 'Paper Six',
  });
  invitationStore.setSaveFailureMode(true);
  const view = createReviewerResponseView();
  document.body.appendChild(view.element);
  const controller = createReviewInvitationController({
    view,
    invitationId: sent.invitation.invitationId,
    decision: 'accept',
  });
  controller.init();
  expect(view.element.querySelector('#response-banner').textContent).toContain('could not be recorded');
  expect(assignmentStore.getAssignments()).toHaveLength(0);
  invitationStore.setSaveFailureMode(false);
});
