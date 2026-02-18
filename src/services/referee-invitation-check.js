import { refereeCount as defaultRefereeCount } from './referee-count.js';
import { assignmentStorage as defaultAssignmentStorage } from './assignment-storage.js';
import { reviewRequestStore as defaultReviewRequestStore } from './review-request-store.js';

function collectInvitationEmails(paperId, reviewRequestStore) {
  const requests = reviewRequestStore.getRequests();
  const invited = new Set();
  requests.forEach((request) => {
    if (request.paperId !== paperId) {
      return;
    }
    if (request.status === 'failed') {
      return;
    }
    if (request.decision || request.status === 'sent') {
      invited.add(request.reviewerEmail);
    }
  });
  return invited;
}

export const refereeInvitationCheck = {
  getMissingInvitations({
    paperId,
    assignmentStorage = defaultAssignmentStorage,
    reviewRequestStore = defaultReviewRequestStore,
    refereeCount = defaultRefereeCount,
    invitationsEnabled = true,
  } = {}) {
    if (!invitationsEnabled) {
      return [];
    }
    const nonDeclined = refereeCount.getNonDeclinedEmails({
      paperId,
      assignmentStorage,
      reviewRequestStore,
    });
    const invited = collectInvitationEmails(paperId, reviewRequestStore);
    return nonDeclined.filter((email) => !invited.has(email));
  },
};
