const INVITATIONS_KEY = 'cms.review_invitations';

let cachedInvitations = null;
let lookupFailure = false;
let saveFailure = false;

function loadInvitations() {
  if (lookupFailure) {
    throw new Error('lookup_failure');
  }
  if (cachedInvitations) {
    return cachedInvitations;
  }
  const raw = localStorage.getItem(INVITATIONS_KEY);
  cachedInvitations = raw ? JSON.parse(raw) : [];
  return cachedInvitations;
}

function persistInvitations(invitations) {
  if (saveFailure) {
    throw new Error('save_failure');
  }
  localStorage.setItem(INVITATIONS_KEY, JSON.stringify(invitations));
  cachedInvitations = invitations;
}

export const invitationStore = {
  setLookupFailureMode(enabled) {
    lookupFailure = Boolean(enabled);
  },
  setSaveFailureMode(enabled) {
    saveFailure = Boolean(enabled);
  },
  reset() {
    lookupFailure = false;
    saveFailure = false;
    cachedInvitations = null;
    localStorage.removeItem(INVITATIONS_KEY);
  },
  getInvitations() {
    return loadInvitations().slice();
  },
  getInvitation(invitationId) {
    return loadInvitations().find((invitation) => invitation.invitationId === invitationId) || null;
  },
  addInvitation(invitation) {
    const invitations = loadInvitations().slice();
    invitations.push({ ...invitation });
    persistInvitations(invitations);
    return invitation;
  },
  updateInvitation(updated) {
    const invitations = loadInvitations().slice();
    const index = invitations.findIndex((entry) => entry.invitationId === updated.invitationId);
    if (index === -1) {
      throw new Error('invitation_not_found');
    }
    invitations[index] = { ...updated };
    persistInvitations(invitations);
    return invitations[index];
  },
};
