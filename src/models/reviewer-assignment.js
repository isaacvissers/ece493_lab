import { normalizeReviewerEmail } from './reviewer.js';
import { ACCEPTED_REVIEWER_STATUSES, REVIEWER_ASSIGNMENT_STATUS } from './reviewer-assignment-status.js';

function generateAssignmentId() {
  return `rassign_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export function createReviewerAssignment({
  assignmentId = null,
  paperId,
  reviewerEmail,
  status = REVIEWER_ASSIGNMENT_STATUS.pending,
  acceptedAt = null,
} = {}) {
  return {
    assignmentId: assignmentId || generateAssignmentId(),
    paperId,
    reviewerEmail: normalizeReviewerEmail(reviewerEmail),
    status,
    acceptedAt,
  };
}

export function isAcceptedReviewerAssignment(assignment) {
  if (!assignment) {
    return false;
  }
  return ACCEPTED_REVIEWER_STATUSES.includes(assignment.status);
}
