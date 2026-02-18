import { refereeCount as defaultRefereeCount } from './referee-count.js';
import { assignmentStorage as defaultAssignmentStorage } from './assignment-storage.js';
import { reviewRequestStore as defaultReviewRequestStore } from './review-request-store.js';

export const refereeAssignmentGuard = {
  canAssign({
    paperId,
    assignmentStorage = defaultAssignmentStorage,
    reviewRequestStore = defaultReviewRequestStore,
    refereeCount = defaultRefereeCount,
  } = {}) {
    const count = refereeCount.getCount({ paperId, assignmentStorage, reviewRequestStore });
    if (count >= 3) {
      return { ok: false, reason: 'fourth_assignment', count };
    }
    return { ok: true, count };
  },
};
