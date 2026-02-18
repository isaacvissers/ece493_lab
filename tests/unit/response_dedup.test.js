import { responseRecorder } from '../../src/services/response-recorder.js';
import { invitationStore } from '../../src/services/invitation-store.js';
import { createReviewInvitation } from '../../src/models/review_invitation.js';

beforeEach(() => {
  invitationStore.reset();
});

test('prevents duplicate responses', () => {
  const invitation = createReviewInvitation({ paperId: 'paper_20', reviewerEmail: 'reviewer@example.com' });
  invitationStore.addInvitation(invitation);
  responseRecorder.recordResponse({ invitationId: invitation.invitationId, decision: 'accept' });
  const second = responseRecorder.recordResponse({ invitationId: invitation.invitationId, decision: 'accept' });
  expect(second.reason).toBe('duplicate_response');
});
