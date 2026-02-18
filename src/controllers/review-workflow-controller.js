const START_FAILURE_MESSAGE = 'Review could not be started. Please try again.';

export function createReviewWorkflowController({
  view,
  readinessController,
  assignmentStorage,
  paperId,
} = {}) {
  function loadPaper() {
    const paper = assignmentStorage.getPaper(paperId);
    if (!paper) {
      view.setStatus('Paper not found.', true);
      return null;
    }
    view.setPaper(paper);
    return paper;
  }

  function handleStartReview() {
    const result = readinessController.evaluateReadiness();
    if (!result.ok || !result.ready) {
      return;
    }
    try {
      assignmentStorage.updatePaperStatus({ paperId, status: 'in_review' });
      view.setStatus('Review started.', false);
    } catch (error) {
      view.setStatus(START_FAILURE_MESSAGE, true);
    }
  }

  return {
    init() {
      loadPaper();
      view.onStartReview(handleStartReview);
    },
  };
}
