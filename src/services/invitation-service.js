import { createReviewInvitation } from '../models/review_invitation.js';
import { invitationStore as defaultInvitationStore } from './invitation-store.js';
import { invitationEmail as defaultInvitationEmail } from './invitation-email.js';
import { invitationLog as defaultInvitationLog } from './invitation-log.js';
import { responseRecorder as defaultResponseRecorder } from './response-recorder.js';

export const invitationService = {
  sendInvitation({
    paperId,
    reviewerEmail,
    paperTitle,
    baseUrl,
    invitationStore = defaultInvitationStore,
    invitationEmail = defaultInvitationEmail,
    invitationLog = defaultInvitationLog,
  } = {}) {
    const invitation = createReviewInvitation({ paperId, reviewerEmail });
    try {
      invitationStore.addInvitation(invitation);
    } catch (error) {
      return { ok: false, reason: 'invitation_store_failed' };
    }

    const result = invitationEmail.sendInvitation({
      invitation,
      paper: { id: paperId, title: paperTitle || paperId, baseUrl },
    });

    if (!result.ok) {
      if (invitationLog) {
        invitationLog.logFailure({
          errorType: 'send_failed',
          message: 'invitation_send_failed',
          context: invitation.invitationId,
        });
      }
      return { ok: false, reason: 'send_failed', invitation };
    }

    return { ok: true, invitation, email: result.email };
  },
  resendInvitation({
    invitationId,
    paperTitle,
    baseUrl,
    invitationStore = defaultInvitationStore,
    invitationEmail = defaultInvitationEmail,
    invitationLog = defaultInvitationLog,
  } = {}) {
    const existing = invitationStore.getInvitation(invitationId);
    if (!existing) {
      return { ok: false, reason: 'not_found' };
    }
    const resetInvitation = {
      ...existing,
      status: 'pending',
      sentAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      respondedAt: null,
    };
    try {
      invitationStore.updateInvitation(resetInvitation);
    } catch (error) {
      return { ok: false, reason: 'invitation_store_failed' };
    }
    const result = invitationEmail.sendInvitation({
      invitation: resetInvitation,
      paper: { id: resetInvitation.paperId, title: paperTitle || resetInvitation.paperId, baseUrl },
    });
    if (!result.ok) {
      if (invitationLog) {
        invitationLog.logFailure({
          errorType: 'send_failed',
          message: 'invitation_send_failed',
          context: resetInvitation.invitationId,
        });
      }
      return { ok: false, reason: 'send_failed', invitation: resetInvitation };
    }
    return { ok: true, invitation: resetInvitation, email: result.email };
  },
  recordResponse({
    invitationId,
    decision,
    responseRecorder = defaultResponseRecorder,
    invitationLog = defaultInvitationLog,
  } = {}) {
    const result = responseRecorder.recordResponse({ invitationId, decision });
    if (!result.ok && (result.reason === 'record_failed' || result.reason === 'invitation_store_failed')) {
      if (invitationLog) {
        invitationLog.logFailure({
          errorType: 'record_failed',
          message: 'invitation_record_failed',
          context: invitationId,
        });
      }
    }
    return result;
  },
};
