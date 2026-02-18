function generateAssignmentId() {
  return `asg_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export function createAssignment({
  id = null,
  paperId,
  reviewerEmail,
  status = 'active',
  assignedAt = null,
} = {}) {
  const timestamp = assignedAt || new Date().toISOString();
  return {
    assignmentId: id || generateAssignmentId(),
    paperId,
    reviewerEmail,
    status,
    assignedAt: timestamp,
  };
}

export function isActiveAssignment(assignment) {
  if (!assignment) {
    return false;
  }
  return assignment.status === 'active' || assignment.status === 'accepted';
}

export function isSameAssignment(assignment, paperId, reviewerEmail) {
  if (!assignment) {
    return false;
  }
  return assignment.paperId === paperId && assignment.reviewerEmail === reviewerEmail;
}
