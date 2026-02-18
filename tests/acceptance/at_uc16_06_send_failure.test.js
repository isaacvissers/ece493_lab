import { invitationService } from '../../src/services/invitation-service.js';
import { invitationEmail } from '../../src/services/invitation-email.js';
import { invitationStore } from '../../src/services/invitation-store.js';
import { invitationLog } from '../../src/services/invitation-log.js';

beforeEach(() => {
  invitationStore.reset();
  invitationEmail.clear();
  invitationLog.clear();
});

test('send failure logs and keeps invitation pending', () => {
  invitationEmail.setFailureMode(true);
  const result = invitationService.sendInvitation({
    paperId: 'paper_5',
    reviewerEmail: 'reviewer@example.com',
    paperTitle: 'Paper Five',
  });
  expect(result.ok).toBe(false);
  const stored = invitationStore.getInvitations()[0];
  expect(stored.status).toBe('pending');
  expect(invitationLog.getFailures()).toHaveLength(1);
});
