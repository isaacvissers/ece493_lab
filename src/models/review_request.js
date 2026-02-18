function generateRequestId() {
  return `req_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export function createReviewRequest({
  id = null,
  assignmentId,
  paperId,
  reviewerEmail,
  status = 'sent',
  sentAt = null,
  decision = null,
  respondedAt = null,
} = {}) {
  const timestamp = sentAt || new Date().toISOString();
  return {
    requestId: id || generateRequestId(),
    assignmentId,
    paperId,
    reviewerEmail,
    status,
    sentAt: timestamp,
    decision,
    respondedAt,
  };
}

export function isResolvedRequest(request) {
  return Boolean(request && request.decision);
}
