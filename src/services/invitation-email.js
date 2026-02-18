const sentInvitations = [];
let failureMode = false;

function buildLinks(invitationId, baseUrl) {
  const prefix = baseUrl || 'https://cms.local/review-invitations';
  return {
    accept: `${prefix}/${invitationId}/respond?decision=accept`,
    reject: `${prefix}/${invitationId}/respond?decision=reject`,
  };
}

export const invitationEmail = {
  setFailureMode(enabled) {
    failureMode = Boolean(enabled);
  },
  clear() {
    failureMode = false;
    sentInvitations.length = 0;
  },
  getSent() {
    return sentInvitations.slice();
  },
  sendInvitation({ invitation, paper } = {}) {
    if (failureMode) {
      return { ok: false, error: 'send_failed' };
    }
    const links = buildLinks(invitation.invitationId, paper && paper.baseUrl);
    const subject = `Review invitation for ${paper ? paper.title : invitation.paperId}`;
    const body = [
      `Paper: ${paper ? paper.title : invitation.paperId}`,
      `Paper ID: ${invitation.paperId}`,
      'Role: Reviewer',
      `Accept: ${links.accept}`,
      `Reject: ${links.reject}`,
    ].join('\n');
    const entry = {
      invitationId: invitation.invitationId,
      reviewerEmail: invitation.reviewerEmail,
      subject,
      body,
      links,
      sentAt: new Date().toISOString(),
    };
    sentInvitations.push(entry);
    return { ok: true, email: entry };
  },
};
