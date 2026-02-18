const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

function generateInvitationId() {
  return `inv_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export function createReviewInvitation({
  id = null,
  paperId,
  reviewerEmail,
  status = 'pending',
  sentAt = null,
  expiresAt = null,
  respondedAt = null,
} = {}) {
  const timestamp = sentAt || new Date().toISOString();
  const expiry = expiresAt || new Date(new Date(timestamp).getTime() + SEVEN_DAYS_MS).toISOString();
  return {
    invitationId: id || generateInvitationId(),
    paperId,
    reviewerEmail,
    status,
    sentAt: timestamp,
    expiresAt: expiry,
    respondedAt,
  };
}

export function isInvitationExpired(invitation, now = Date.now()) {
  if (!invitation || !invitation.expiresAt) {
    return false;
  }
  return new Date(invitation.expiresAt).getTime() <= now;
}
