import { invitationService } from '../../src/services/invitation-service.js';
import { invitationEmail } from '../../src/services/invitation-email.js';
import { invitationStore } from '../../src/services/invitation-store.js';

beforeEach(() => {
  invitationEmail.clear();
  invitationStore.reset();
});

test('invitation email includes paper details and links', () => {
  const result = invitationService.sendInvitation({
    paperId: 'paper_1',
    reviewerEmail: 'reviewer@example.com',
    paperTitle: 'Paper One',
  });
  expect(result.ok).toBe(true);
  const sent = invitationEmail.getSent()[0];
  expect(sent.body).toContain('Paper One');
  expect(sent.body).toContain('Accept');
  expect(sent.body).toContain('Reject');
});
