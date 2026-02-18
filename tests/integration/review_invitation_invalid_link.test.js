import { invitationStore } from '../../src/services/invitation-store.js';
import { createReviewInvitation } from '../../src/models/review_invitation.js';
import { createReviewerResponseView } from '../../src/views/reviewer-response-view.js';
import { createReviewInvitationController } from '../../src/controllers/review-invitation-controller.js';

beforeEach(() => {
  invitationStore.reset();
  document.body.innerHTML = '';
});

test('expired link shows error and marks expired', () => {
  const invitation = createReviewInvitation({
    paperId: 'paper_11',
    reviewerEmail: 'reviewer@example.com',
    expiresAt: '2026-02-01T00:00:00.000Z',
  });
  invitationStore.addInvitation(invitation);
  const view = createReviewerResponseView();
  document.body.appendChild(view.element);
  const controller = createReviewInvitationController({
    view,
    invitationId: invitation.invitationId,
    decision: 'accept',
  });
  controller.init();
  const stored = invitationStore.getInvitation(invitation.invitationId);
  expect(stored.status).toBe('expired');
  expect(view.element.querySelector('#response-banner').textContent).toContain('invalid or expired');
});
