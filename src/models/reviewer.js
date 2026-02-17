function generateReviewerId() {
  return `rev_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export function normalizeReviewerEmail(email) {
  return (email || '').trim().toLowerCase();
}

export function createReviewer({ id = null, email = '', assignments = [] } = {}) {
  const normalizedEmail = normalizeReviewerEmail(email);
  return {
    reviewerId: id || generateReviewerId(),
    email: normalizedEmail,
    activeAssignmentCount: getActiveAssignmentCount(assignments),
  };
}

export function getActiveAssignmentCount(assignments = []) {
  if (!Array.isArray(assignments)) {
    return 0;
  }
  return assignments.filter((assignment) => assignment && assignment.status === 'active').length;
}
