function generateDraftId() {
  return `draft_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export function createReviewDraft({
  draftId = null,
  paperId,
  reviewerEmail,
  content = {},
  updatedAt = null,
} = {}) {
  return {
    draftId: draftId || generateDraftId(),
    paperId,
    reviewerEmail,
    content,
    updatedAt: updatedAt || new Date().toISOString(),
  };
}
