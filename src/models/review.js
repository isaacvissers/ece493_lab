function generateReviewId() {
  return `rev_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export function createReview({
  reviewId = null,
  paperId,
  reviewerId,
  status = 'draft',
  content = {},
  submittedAt = null,
} = {}) {
  return {
    reviewId: reviewId || generateReviewId(),
    paperId,
    reviewerId,
    status,
    content,
    submittedAt,
  };
}

export function isSubmittedReview(review) {
  return Boolean(review && review.status === 'submitted');
}
