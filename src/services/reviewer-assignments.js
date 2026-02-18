import { assignmentStore as defaultAssignmentStore } from './assignment-store.js';
import { assignmentStorage as defaultAssignmentStorage } from './assignment-storage.js';
import { submissionStorage as defaultSubmissionStorage } from './submission-storage.js';
import { errorLog as defaultErrorLog } from './error-log.js';
import { isAcceptedReviewerAssignment } from '../models/reviewer-assignment.js';

function buildListItem({ assignment, paper, manuscript }) {
  return {
    assignmentId: assignment.assignmentId,
    paperId: assignment.paperId,
    reviewerEmail: assignment.reviewerEmail,
    title: (paper && paper.title) || (manuscript && manuscript.title) || 'Unavailable paper',
    status: assignment.status,
  };
}

export const reviewerAssignments = {
  listAcceptedAssignments({
    reviewerEmail,
    assignmentStore = defaultAssignmentStore,
    assignmentStorage = defaultAssignmentStorage,
    submissionStorage = defaultSubmissionStorage,
    errorLog = defaultErrorLog,
  } = {}) {
    if (!reviewerEmail) {
      return { ok: true, assignments: [] };
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
      return { ok: false, assignments: [], reason: 'retrieval_failed' };
    }

    const normalized = reviewerEmail.toLowerCase();
    const accepted = assignments.filter((assignment) => (
      assignment
      && assignment.reviewerEmail === normalized
      && isAcceptedReviewerAssignment(assignment)
    ));

    const manuscripts = submissionStorage.getManuscripts();

    const list = accepted.map((assignment) => {
      const paper = assignmentStorage.getPaper(assignment.paperId);
      const manuscript = manuscripts.find((entry) => entry.id === assignment.paperId) || null;
      return buildListItem({ assignment, paper, manuscript });
    });

    return { ok: true, assignments: list };
  },
};
