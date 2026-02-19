import { assignmentStorage as defaultAssignmentStorage } from './assignment-storage.js';
import { reviewRequestStore as defaultReviewRequestStore } from './review-request-store.js';
import { normalizeRefereeEmail } from '../models/referee-assignment.js';

function normalizeList(emails) {
  return Array.isArray(emails)
    ? emails.map((email) => normalizeRefereeEmail(email)).filter(Boolean)
    : [];
}

function getPendingInvitationEmails(paperId, reviewRequestStore) {
  const requests = reviewRequestStore.getRequests();
  return requests
    .filter((request) => (
      request.paperId === paperId
      && !request.decision
      && request.status !== 'failed'
    ))
    .map((request) => normalizeRefereeEmail(request.reviewerEmail))
    .filter(Boolean);
}

export const refereeCount = {
  getNonDeclinedEmails({ paperId, assignmentStorage = defaultAssignmentStorage, reviewRequestStore = defaultReviewRequestStore } = {}) {
    const paper = assignmentStorage.getPaper(paperId);
    if (!paper) {
      return [];
    }

    const assigned = normalizeList(paper.assignedRefereeEmails);
    const pending = getPendingInvitationEmails(paperId, reviewRequestStore);
    const merged = new Set([...assigned, ...pending]);
    return Array.from(merged.values());
  },
  getCount({ paperId, assignmentStorage = defaultAssignmentStorage, reviewRequestStore = defaultReviewRequestStore } = {}) {
    return refereeCount.getNonDeclinedEmails({ paperId, assignmentStorage, reviewRequestStore }).length;
  },
};
