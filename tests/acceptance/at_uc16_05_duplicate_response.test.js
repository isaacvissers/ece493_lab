import { invitationService } from '../../src/services/invitation-service.js';
import { createReviewerResponseView } from '../../src/views/reviewer-response-view.js';
import { createReviewInvitationController } from '../../src/controllers/review-invitation-controller.js';
import { invitationStore } from '../../src/services/invitation-store.js';

beforeEach(() => {
  invitationStore.reset();
  document.body.innerHTML = '';
});

test('duplicate responses are blocked', () => {
  const sent = invitationService.sendInvitation({
    paperId: 'paper_4',
    reviewerEmail: 'reviewer@example.com',
    paperTitle: 'Paper Four',
  });
  const firstView = createReviewerResponseView();
  document.body.appendChild(firstView.element);
  const firstController = createReviewInvitationController({
    view: firstView,
    invitationId: sent.invitation.invitationId,
    decision: 'accept',
  });
  firstController.init();

  document.body.innerHTML = '';
  const secondView = createReviewerResponseView();
  document.body.appendChild(secondView.element);
  const secondController = createReviewInvitationController({
    view: secondView,
    invitationId: sent.invitation.invitationId,
    decision: 'reject',
  });
  secondController.init();
  expect(secondView.element.querySelector('#response-banner').textContent).toContain('already recorded');
});
