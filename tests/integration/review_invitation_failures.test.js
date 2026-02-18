import { invitationService } from '../../src/services/invitation-service.js';
import { invitationEmail } from '../../src/services/invitation-email.js';
import { invitationStore } from '../../src/services/invitation-store.js';
import { invitationLog } from '../../src/services/invitation-log.js';
import { createReviewerResponseView } from '../../src/views/reviewer-response-view.js';
import { createReviewInvitationController } from '../../src/controllers/review-invitation-controller.js';

beforeEach(() => {
  invitationStore.reset();
  invitationEmail.clear();
  invitationLog.clear();
  document.body.innerHTML = '';
});

test('send failure logs and leaves invitation pending', () => {
  invitationEmail.setFailureMode(true);
  const result = invitationService.sendInvitation({
    paperId: 'paper_12',
    reviewerEmail: 'reviewer@example.com',
    paperTitle: 'Paper Twelve',
  });
  expect(result.ok).toBe(false);
  expect(invitationLog.getFailures()).toHaveLength(1);
});

test('record failure logs from controller', () => {
  const sent = invitationService.sendInvitation({
    paperId: 'paper_13',
    reviewerEmail: 'reviewer@example.com',
    paperTitle: 'Paper Thirteen',
  });
  invitationStore.setSaveFailureMode(true);
  const view = createReviewerResponseView();
  document.body.appendChild(view.element);
  const controller = createReviewInvitationController({
    view,
    invitationId: sent.invitation.invitationId,
    decision: 'accept',
    invitationLog,
  });
  controller.init();
  expect(invitationLog.getFailures()).toHaveLength(1);
  invitationStore.setSaveFailureMode(false);
});
