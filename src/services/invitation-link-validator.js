import { invitationStore as defaultInvitationStore } from './invitation-store.js';
import { isInvitationExpired } from '../models/review_invitation.js';

export const invitationLinkValidator = {
  validate({ invitationId, now = Date.now(), invitationStore = defaultInvitationStore } = {}) {
    const invitation = invitationStore.getInvitation(invitationId);
    if (!invitation) {
      return { ok: false, reason: 'not_found' };
    }
    if (invitation.status !== 'pending') {
      return { ok: false, reason: 'duplicate_response', invitation };
    }
    if (isInvitationExpired(invitation, now)) {
      const expired = { ...invitation, status: 'expired' };
      try {
        invitationStore.updateInvitation(expired);
      } catch (error) {
        throw new Error('validation_failed');
      }
      return { ok: false, reason: 'expired', invitation: expired };
    }
    return { ok: true, invitation };
  },
};
