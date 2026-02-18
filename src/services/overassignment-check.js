import { reviewerCount as defaultReviewerCount } from './reviewer-count.js';
import { errorLog as defaultErrorLog } from './error-log.js';

export const overassignmentCheck = {
  evaluate({ paperId, reviewerCount = defaultReviewerCount, errorLog = defaultErrorLog } = {}) {
    let count = null;
    try {
      count = reviewerCount.getCountForPaper({ paperId });
    } catch (error) {
      if (errorLog) {
        errorLog.logFailure({
          errorType: 'overassignment_count_failure',
          message: error && error.message ? error.message : 'count_failure',
          context: paperId,
        });
      }
      return { ok: false, reason: 'count_failure', count: null };
    }
    return {
      ok: true,
      count,
      overassigned: count > 3,
    };
  },
};
