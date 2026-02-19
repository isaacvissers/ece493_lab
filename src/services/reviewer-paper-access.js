import { assignmentStore as defaultAssignmentStore } from './assignment-store.js';
import { assignmentStorage as defaultAssignmentStorage } from './assignment-storage.js';
import { submissionStorage as defaultSubmissionStorage } from './submission-storage.js';
import { errorLog as defaultErrorLog } from './error-log.js';
import { isAcceptedReviewerAssignment } from '../models/reviewer-assignment.js';
import { isPaperAvailable } from '../models/paper.js';
import { isManuscriptAvailable } from '../models/manuscript.js';

export const reviewerPaperAccess = {
  getPaperDetails({
    reviewerEmail,
    paperId,
    assignmentStore = defaultAssignmentStore,
    assignmentStorage = defaultAssignmentStorage,
    submissionStorage = defaultSubmissionStorage,
    errorLog = defaultErrorLog,
  } = {}) {
    if (!reviewerEmail || !paperId) {
      return { ok: false, reason: 'invalid_request' };
    }

    let assignments = [];
    try {
      assignments = assignmentStore.getAssignments();
    } catch (error) {
      if (errorLog) {
        errorLog.logFailure({
          errorType: 'assignment_retrieval_failure',
          message: error && error.message ? error.message : 'assignment_retrieval_failed',
          context: reviewerEmail,
        });
      }
      return { ok: false, reason: 'retrieval_failed' };
    }

    const normalized = reviewerEmail.toLowerCase();
    const assignment = assignments.find((entry) => (
      entry
      && entry.reviewerEmail === normalized
      && entry.paperId === paperId
      && isAcceptedReviewerAssignment(entry)
    ));

    if (!assignment) {
      return { ok: false, reason: 'not_accepted' };
    }

    const paper = assignmentStorage.getPaper(paperId);
    const manuscript = submissionStorage.getManuscripts().find((entry) => entry.id === paperId) || null;

    if (!paper || !isPaperAvailable(paper)) {
      return { ok: false, reason: 'unavailable' };
    }

    if (!manuscript || !isManuscriptAvailable(manuscript)) {
      return { ok: false, reason: 'unavailable' };
    }

    const manuscriptLink = manuscript.file.originalName ?? null;
    return {
      ok: true,
      assignment,
      paper,
      manuscript,
      manuscriptLink,
    };
  },
};
