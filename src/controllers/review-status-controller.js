import { reviewStatusService as defaultReviewStatusService } from '../services/review-status-service.js';

export function createReviewStatusController({
  view,
  sessionState,
  paperId,
  reviewStatusService = defaultReviewStatusService,
} = {}) {
  function getReviewerEmail() {
    const user = sessionState.getCurrentUser();
    return user && user.email ? user.email : null;
  }

  return {
    init() {
      const reviewerEmail = getReviewerEmail();
      const status = reviewStatusService.getStatus({ paperId, reviewerEmail });
      if (status.ok) {
        view.setStatus(`Review status: ${status.status}`, false);
      } else {
        view.setStatus('Review status not found.', true);
      }
    },
  };
}
