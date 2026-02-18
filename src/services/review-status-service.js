import { reviewSubmissionService } from './review-submission-service.js';

export const reviewStatusService = {
  getStatus({ paperId, reviewerEmail } = {}) {
    return reviewSubmissionService.getSubmissionStatus({ paperId, reviewerEmail });
  },
};
