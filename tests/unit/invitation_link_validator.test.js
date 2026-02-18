import { invitationLinkValidator } from '../../src/services/invitation-link-validator.js';
import { invitationStore } from '../../src/services/invitation-store.js';
import { createReviewInvitation } from '../../src/models/review_invitation.js';

beforeEach(() => {
  invitationStore.reset();
});

test('validates pending invitations', () => {
  const invitation = createReviewInvitation({ paperId: 'paper_1', reviewerEmail: 'reviewer@example.com' });
  invitationStore.addInvitation(invitation);
  const result = invitationLinkValidator.validate({ invitationId: invitation.invitationId, invitationStore });
  expect(result.ok).toBe(true);
});

test('defaults to store and returns not_found when no args provided', () => {
  const result = invitationLinkValidator.validate();
  expect(result.reason).toBe('not_found');
});

test('returns not_found for missing invitation', () => {
  const result = invitationLinkValidator.validate({ invitationId: 'missing', invitationStore });
  expect(result.reason).toBe('not_found');
});

test('returns duplicate_response for non-pending status', () => {
  const invitation = createReviewInvitation({ paperId: 'paper_1', reviewerEmail: 'reviewer@example.com', status: 'accepted' });
  invitationStore.addInvitation(invitation);
  const result = invitationLinkValidator.validate({ invitationId: invitation.invitationId, invitationStore });
  expect(result.reason).toBe('duplicate_response');
});

test('marks expired invitations', () => {
  const invitation = createReviewInvitation({
    paperId: 'paper_1',
    reviewerEmail: 'reviewer@example.com',
    expiresAt: '2026-02-01T00:00:00.000Z',
  });
  invitationStore.addInvitation(invitation);
  const result = invitationLinkValidator.validate({
    invitationId: invitation.invitationId,
    invitationStore,
    now: new Date('2026-02-02T00:00:00.000Z').getTime(),
  });
  expect(result.reason).toBe('expired');
  const stored = invitationStore.getInvitation(invitation.invitationId);
  expect(stored.status).toBe('expired');
});

test('throws on validation save failure', () => {
  const invitation = createReviewInvitation({
    paperId: 'paper_1',
    reviewerEmail: 'reviewer@example.com',
    expiresAt: '2026-02-01T00:00:00.000Z',
  });
  invitationStore.addInvitation(invitation);
  invitationStore.setSaveFailureMode(true);
  expect(() => invitationLinkValidator.validate({
    invitationId: invitation.invitationId,
    invitationStore,
    now: new Date('2026-02-02T00:00:00.000Z').getTime(),
  })).toThrow('validation_failed');
  invitationStore.setSaveFailureMode(false);
});

test('propagates lookup failures', () => {
  const invitation = createReviewInvitation({ paperId: 'paper_2', reviewerEmail: 'reviewer@example.com' });
  invitationStore.addInvitation(invitation);
  invitationStore.setLookupFailureMode(true);
  expect(() => invitationLinkValidator.validate({ invitationId: invitation.invitationId, invitationStore }))
    .toThrow('lookup_failure');
  invitationStore.setLookupFailureMode(false);
});
