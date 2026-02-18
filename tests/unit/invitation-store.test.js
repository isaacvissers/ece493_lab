import { invitationStore } from '../../src/services/invitation-store.js';
import { createReviewInvitation } from '../../src/models/review_invitation.js';

beforeEach(() => {
  invitationStore.reset();
});

test('stores and retrieves invitations', () => {
  const invitation = createReviewInvitation({ paperId: 'paper_1', reviewerEmail: 'reviewer@example.com' });
  invitationStore.addInvitation(invitation);
  expect(invitationStore.getInvitation(invitation.invitationId)).not.toBeNull();
  expect(invitationStore.getInvitations()).toHaveLength(1);
});

test('returns empty list when no invitations are stored', () => {
  const invitations = invitationStore.getInvitations();
  expect(invitations).toEqual([]);
});

test('loads invitations from localStorage when cache is empty', () => {
  localStorage.setItem('cms.review_invitations', JSON.stringify([
    { invitationId: 'inv_local', paperId: 'paper_local', reviewerEmail: 'local@example.com', status: 'pending' },
  ]));
  const invitations = invitationStore.getInvitations();
  expect(invitations).toHaveLength(1);
});

test('returns cached invitations after first load', () => {
  const invitation = createReviewInvitation({ paperId: 'paper_cache', reviewerEmail: 'reviewer@example.com' });
  invitationStore.addInvitation(invitation);
  const first = invitationStore.getInvitations();
  const second = invitationStore.getInvitations();
  expect(second).toHaveLength(first.length);
});

test('updates invitations', () => {
  const invitation = createReviewInvitation({ paperId: 'paper_1', reviewerEmail: 'reviewer@example.com' });
  invitationStore.addInvitation(invitation);
  const updated = invitationStore.updateInvitation({ ...invitation, status: 'accepted' });
  expect(updated.status).toBe('accepted');
});

test('throws on missing invitation update', () => {
  expect(() => invitationStore.updateInvitation({ invitationId: 'missing' })).toThrow('invitation_not_found');
});

test('throws on lookup failure', () => {
  invitationStore.setLookupFailureMode(true);
  expect(() => invitationStore.getInvitations()).toThrow('lookup_failure');
  invitationStore.setLookupFailureMode(false);
});

test('throws on save failure', () => {
  invitationStore.setSaveFailureMode(true);
  const invitation = createReviewInvitation({ paperId: 'paper_1', reviewerEmail: 'reviewer@example.com' });
  expect(() => invitationStore.addInvitation(invitation)).toThrow('save_failure');
  invitationStore.setSaveFailureMode(false);
});
