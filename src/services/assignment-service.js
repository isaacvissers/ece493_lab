import { assignmentStore } from './assignment-store.js';
import { assignmentValidator } from './assignment-validator.js';
import { createAssignment } from '../models/assignment.js';
import { normalizeReviewerEmail } from '../models/reviewer.js';
import { assignmentRules } from './assignment-rules.js';
import { reviewRequestService } from './review-request-service.js';

const DEFAULT_LIMIT = 5;

function mapStoreError(error) {
  if (!error) {
    return 'save_failed';
  }
  if (error.message === 'lookup_failure') {
    return 'lookup_failed';
  }
  if (error.message === 'limit_reached') {
    return 'limit_reached';
  }
  if (error.message === 'duplicate_assignment') {
    return 'already_assigned';
  }
  if (error.message === 'save_failure') {
    return 'save_failed';
  }
  return 'save_failed';
}

export const assignmentService = {
  assignReviewers({ paperId, reviewerEmails, limit = DEFAULT_LIMIT } = {}) {
    const assigned = [];
    const rejected = [];
    const createdAssignments = [];
    const emails = Array.isArray(reviewerEmails) ? reviewerEmails : [];

    emails.forEach((email) => {
      const normalized = normalizeReviewerEmail(email);
      if (!normalized) {
        rejected.push({ email, reason: 'lookup_failed' });
        return;
      }

      let alreadyAssigned = false;
      try {
        alreadyAssigned = assignmentStore.hasActiveAssignment(paperId, normalized);
      } catch (error) {
        rejected.push({ email: normalized, reason: mapStoreError(error) });
        return;
      }
      const uniqueCheck = assignmentValidator.validateUniqueAssignment({ alreadyAssigned });
      if (!uniqueCheck.ok) {
        rejected.push({ email: normalized, reason: uniqueCheck.reason });
        return;
      }

      let activeCount = null;
      try {
        activeCount = assignmentStore.getActiveCountForReviewer(normalized);
      } catch (error) {
        rejected.push({ email: normalized, reason: mapStoreError(error) });
        return;
      }

      const limitCheck = assignmentValidator.validateLimit({ activeCount, limit });
      if (!limitCheck.ok) {
        rejected.push({ email: normalized, reason: limitCheck.reason });
        return;
      }

      try {
        const assignment = createAssignment({ paperId, reviewerEmail: normalized });
        assignmentStore.addAssignment(assignment, { limit });
        assigned.push(normalized);
        createdAssignments.push(assignment);
      } catch (error) {
        rejected.push({ email: normalized, reason: mapStoreError(error) });
      }
    });

    return { assigned, rejected, createdAssignments };
  },
  submitAssignments({ paperId, reviewerEmails, limit = DEFAULT_LIMIT } = {}) {
    let evaluation = null;
    try {
      evaluation = assignmentRules.evaluate({ paperId, reviewerEmails, limit });
    } catch (error) {
      return {
        ok: false,
        failure: 'evaluation_failed',
        accepted: [],
        blocked: [],
        violations: [],
      };
    }

    const accepted = [];
    const blocked = evaluation.violations.map((violation) => ({
      email: violation.reviewerEmail,
      reason: violation.rule,
    }));

    let requestFailures = [];
    if (evaluation.candidates.length) {
      const requestResult = reviewRequestService.sendReviewRequests({
        paperId,
        reviewerEmails: evaluation.candidates,
      });
      requestResult.sent.forEach((request) => {
        accepted.push(request.reviewerEmail);
      });
      requestFailures = requestResult.failed.slice();
      requestResult.failed.forEach((entry) => {
        blocked.push({
          email: entry.email,
          reason: entry.reason || 'request_failed',
        });
      });
    }

    return {
      ok: true,
      accepted,
      blocked,
      violations: evaluation.violations,
      requestFailures,
    };
  },
};
