import { invitationLinkValidator } from './invitation-link-validator.js';
import { invitationStore as defaultInvitationStore } from './invitation-store.js';
import { assignmentStore as defaultAssignmentStore } from './assignment-store.js';
import { createAssignment } from '../models/assignment.js';

export const responseRecorder = {
  recordResponse({
    invitationId,
    decision,
    now = Date.now(),
    invitationStore = defaultInvitationStore,
    assignmentStore = defaultAssignmentStore,
  } = {}) {
    if (decision !== 'accept' && decision !== 'reject') {
      return { ok: false, reason: 'invalid_decision' };
    }

    let validation = null;
    try {
      validation = invitationLinkValidator.validate({ invitationId, now, invitationStore });
    } catch (error) {
      return { ok: false, reason: 'record_failed' };
    }

    if (!validation.ok) {
      return { ok: false, reason: validation.reason, invitation: validation.invitation || null };
    }

    const invitation = validation.invitation;
    const updatedInvitation = {
      ...invitation,
      status: decision === 'accept' ? 'accepted' : 'rejected',
      respondedAt: new Date(now).toISOString(),
    };

    try {
      invitationStore.updateInvitation(updatedInvitation);
    } catch (error) {
      return { ok: false, reason: 'record_failed' };
    }

    const assignment = createAssignment({
      paperId: invitation.paperId,
      reviewerEmail: invitation.reviewerEmail,
      status: decision === 'accept' ? 'accepted' : 'rejected',
      assignedAt: new Date(now).toISOString(),
    });

    try {
      assignmentStore.addAssignment(assignment);
    } catch (error) {
      try {
        invitationStore.updateInvitation({ ...invitation, status: 'pending', respondedAt: null });
      } catch (rollbackError) {
        // best-effort rollback
      }
      return { ok: false, reason: error && error.message ? error.message : 'record_failed' };
    }

    return { ok: true, invitation: updatedInvitation, assignment };
  },
};
