function generateSubmissionId() {
  return `sub_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export function createSubmittedReview({
  submissionId = null,
  paperId,
  reviewerEmail,
  content = {},
  submittedAt = null,
  status = 'submitted',
} = {}) {
  return {
    submissionId: submissionId || generateSubmissionId(),
    paperId,
    reviewerEmail,
    content,
    submittedAt: submittedAt || new Date().toISOString(),
    status,
  };
}

export function isSubmittedReviewFinal(review) {
  return Boolean(review && review.status === 'submitted');
}
