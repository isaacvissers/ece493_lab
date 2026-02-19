import { assignmentStore as defaultAssignmentStore } from './assignment-store.js';
import { reviewFormStore as defaultReviewFormStore } from './review-form-store.js';
import { reviewDraftStore as defaultReviewDraftStore } from './review-draft-store.js';
import { errorLog as defaultErrorLog } from './error-log.js';
import { ACCEPTED_REVIEWER_STATUSES } from '../models/reviewer-assignment-status.js';
import { isFormClosed } from '../models/review-form.js';

function normalizeEmail(email) {
  return (email || '').trim().toLowerCase();
}

export const reviewFormAccess = {
  getForm({
    paperId,
    reviewerEmail,
    assignmentStore = defaultAssignmentStore,
    reviewFormStore = defaultReviewFormStore,
    reviewDraftStore = defaultReviewDraftStore,
    errorLog = defaultErrorLog,
  } = {}) {
    const normalized = normalizeEmail(reviewerEmail);
    if (!paperId || !normalized) {
      return { ok: false, reason: 'unauthorized' };
    }

    let assignments = [];
    try {
      assignments = assignmentStore.getAssignments();
    } catch (error) {
      if (errorLog) {
        errorLog.logFailure({
          errorType: 'review_form_assignment_lookup_failure',
          message: error && error.message ? error.message : 'assignment_lookup_failed',
          context: paperId,
        });
      }
      return { ok: false, reason: 'assignment_lookup_failed' };
    }

    const assignment = assignments.find((entry) => (
      entry && entry.paperId === paperId && entry.reviewerEmail === normalized
    ));

    if (!assignment) {
      return { ok: false, reason: 'not_assigned' };
    }

    if (!ACCEPTED_REVIEWER_STATUSES.includes(assignment.status)) {
      return { ok: false, reason: 'not_accepted' };
    }

    let form = null;
    try {
      form = reviewFormStore.getForm(paperId);
    } catch (error) {
      if (errorLog) {
        errorLog.logFailure({
          errorType: 'review_form_load_failure',
          message: error && error.message ? error.message : 'form_load_failed',
          context: paperId,
        });
      }
      return { ok: false, reason: 'form_failure' };
    }

    if (!form) {
      if (errorLog) {
        errorLog.logFailure({
          errorType: 'review_form_missing',
          message: 'form_missing',
          context: paperId,
        });
      }
      return { ok: false, reason: 'form_missing' };
    }

    let draft = null;
    try {
      draft = reviewDraftStore.getDraft(paperId, normalized);
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

    return {
      ok: true,
      form,
      draft,
      viewOnly: isFormClosed(form),
    };
  },
};
