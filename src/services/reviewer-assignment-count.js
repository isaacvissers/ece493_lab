import { assignmentStore } from './assignment-store.js';

export const reviewerAssignmentCount = {
  getActiveCount(reviewerEmail) {
    return assignmentStore.getActiveCountForReviewer(reviewerEmail);
  },
};
