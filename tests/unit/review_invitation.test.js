import { createReviewInvitation, isInvitationExpired } from '../../src/models/review_invitation.js';

test('creates invitation with generated id and expiry', () => {
  const invitation = createReviewInvitation({ paperId: 'paper_1', reviewerEmail: 'reviewer@example.com' });
  expect(invitation.invitationId).toMatch(/^inv_/);
  expect(invitation.expiresAt).toBeTruthy();
});

test('creates invitation with defaults', () => {
  const invitation = createReviewInvitation();
  expect(invitation.invitationId).toMatch(/^inv_/);
  expect(invitation.status).toBe('pending');
});

test('respects provided id and expiry', () => {
  const invitation = createReviewInvitation({
    id: 'inv_1',
    paperId: 'paper_1',
    reviewerEmail: 'reviewer@example.com',
    sentAt: '2026-02-01T00:00:00.000Z',
    expiresAt: '2026-02-08T00:00:00.000Z',
  });
  expect(invitation.invitationId).toBe('inv_1');
  expect(invitation.expiresAt).toBe('2026-02-08T00:00:00.000Z');
});

test('detects expired invitations', () => {
  const invitation = createReviewInvitation({
    paperId: 'paper_1',
    reviewerEmail: 'reviewer@example.com',
    expiresAt: '2026-02-01T00:00:00.000Z',
  });
  expect(isInvitationExpired(invitation, new Date('2026-02-02T00:00:00.000Z').getTime())).toBe(true);
  expect(isInvitationExpired(invitation, new Date('2026-01-31T00:00:00.000Z').getTime())).toBe(false);
});

test('handles missing expiry data', () => {
  expect(isInvitationExpired(null)).toBe(false);
  const invitation = createReviewInvitation({ paperId: 'paper_2', reviewerEmail: 'reviewer@example.com', expiresAt: null });
  expect(isInvitationExpired(invitation)).toBe(false);
});
