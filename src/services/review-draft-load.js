import { reviewDraftStore as defaultReviewDraftStore } from './review-draft-store.js';
import { errorLog as defaultErrorLog } from './error-log.js';

export const reviewDraftLoad = {
  load({ paperId, reviewerEmail, reviewDraftStore = defaultReviewDraftStore, errorLog = defaultErrorLog } = {}) {
    try {
      return { ok: true, draft: reviewDraftStore.getDraft(paperId, reviewerEmail) };
    } catch (error) {
      if (errorLog) {
        errorLog.logFailure({
          errorType: 'review_draft_load_failure',
          message: error && error.message ? error.message : 'draft_load_failed',
          context: paperId,
        });
      }
      return { ok: false, reason: 'draft_failure' };
    }
  },
};
