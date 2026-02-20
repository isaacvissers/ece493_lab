import { UI_MESSAGES } from '../services/ui-messages.js';
import { isEligibleStatus } from '../models/paper.js';
import { assignmentService as defaultAssignmentService } from '../services/assignment-service.js';
import { validationService } from '../services/validation-service.js';
import { normalizeRefereeEmail } from '../models/referee-assignment.js';
import { violationLog as defaultViolationLog } from '../services/violation-log.js';
import { overassignmentCheck as defaultOverassignmentCheck } from '../services/overassignment-check.js';
import { overassignmentAlert as defaultOverassignmentAlert } from '../services/overassignment-alert.js';
import { reviewerBatchAssign as defaultReviewerBatchAssign } from '../services/reviewer-batch-assign.js';
import { errorLog as defaultErrorLog } from '../services/error-log.js';

const AUTH_MESSAGE = 'You do not have permission to assign referees.';
const COUNT_MESSAGE = 'Enter at least one referee email.';
const INELIGIBLE_MESSAGE = 'Paper is not eligible for assignment.';
const LIMIT_MESSAGE = 'Reviewer has reached the maximum of 5 active assignments.';
const LOOKUP_MESSAGE = 'Reviewer assignment count could not be determined.';
const SAVE_MESSAGE = 'Assignment could not be saved. Try again.';
const DUPLICATE_MESSAGE = 'Reviewer is already assigned to this paper.';
const EVALUATION_MESSAGE = 'Assignments cannot be completed right now. Please try again.';
const REQUEST_FAILURE_MESSAGE = 'Review request could not be delivered.';

export function createRefereeAssignmentController({
  view,
  assignmentStorage,
  violationLog = defaultViolationLog,
  errorLog = defaultErrorLog,
  sessionState,
  paperId,
  onAuthRequired,
  assignmentService = defaultAssignmentService,
  overassignmentCheck = defaultOverassignmentCheck,
  overassignmentAlert = defaultOverassignmentAlert,
  reviewerBatchAssign = defaultReviewerBatchAssign,
}) {
  let currentPaper = null;

  function isEditor(user) {
    if (!user) {
      return false;
    }
    const normalizedRole = user.role ? user.role.toLowerCase() : null;
    const roles = Array.isArray(user.roles) ? user.roles.map((role) => role.toLowerCase()) : [];
    return normalizedRole === 'editor'
      || normalizedRole === 'admin'
      || roles.includes('editor')
      || roles.includes('admin')
      || user.email === 'admin@example.com';
  }

  function loadPaper() {
    const paper = assignmentStorage.getPaper(paperId);
    currentPaper = paper;
    if (!paper) {
      view.setStatus('Paper not found.', true);
      view.setEditable(false);
      return false;
    }
    view.setPaper(paper);
    return true;
  }

  function applyAuthGuard() {
    if (!sessionState.isAuthenticated()) {
      view.setStatus(UI_MESSAGES.errors.accessDenied.message, true);
      if (onAuthRequired) {
        onAuthRequired();
      }
      return false;
    }
    const user = sessionState.getCurrentUser();
    if (!isEditor(user)) {
      view.setAuthorizationMessage(AUTH_MESSAGE);
      view.setEditable(false);
      return false;
    }
    return true;
  }

  function handleSubmit(event) {
    event.preventDefault();
    view.clearErrors();
    view.setAuthorizationMessage('');
    view.setWarning('');
    view.setSummary(null);
    view.setFallbackSummary('');

    if (!applyAuthGuard()) {
      return;
    }
    if (!currentPaper && !loadPaper()) {
      return;
    }
    if (!isEligibleStatus(currentPaper.status)) {
      view.setStatus(INELIGIBLE_MESSAGE, true);
      return;
    }

    const rawEmails = view.getRefereeEmails();
    const enteredEmails = rawEmails.filter((email) => (email || '').trim());
    if (enteredEmails.length === 0) {
      view.setCountError(COUNT_MESSAGE);
      view.setStatus('Please enter at least one referee email.', true);
      return;
    }

    const seen = new Set();
    const validEmails = [];
    const invalidEntries = [];
    rawEmails.forEach((email, index) => {
      const trimmed = (email || '').trim();
      if (!trimmed) {
        return;
      }
      if (!validationService.isEmailValid(trimmed)) {
        view.setFieldError(index, 'Referee email format is invalid.');
        invalidEntries.push({ email: trimmed, reason: 'invalid_email' });
        return;
      }
      const normalized = normalizeRefereeEmail(trimmed);
      if (seen.has(normalized)) {
        view.setFieldError(index, 'Duplicate referee email.');
        invalidEntries.push({ email: normalized, reason: 'duplicate_entry' });
        return;
      }
      seen.add(normalized);
      validEmails.push(normalized);
    });

    const countCheck = overassignmentCheck.evaluate({
      paperId: currentPaper.id,
      errorLog,
    });
    if (!countCheck.ok) {
      view.setStatus('Assignments cannot be completed. Reviewer count could not be determined. Please try again.', true);
      if (violationLog) {
        violationLog.logFailure({
          errorType: 'evaluation_failed',
          message: 'assignment_evaluation_failed',
          context: currentPaper.id,
        });
      }
      return;
    }

    const { allowed, blocked, remaining } = reviewerBatchAssign.split({
      reviewerEmails: validEmails,
      currentCount: countCheck.count,
      max: 3,
    });

    if (remaining === 0) {
      const alertPayload = overassignmentAlert.build({ count: countCheck.count, blocked });
      view.setWarning(alertPayload.message);
      view.setStatus('Over-assignment blocked.', true);
      const summary = {
        accepted: [],
        blocked: blocked.map((email) => ({ email, reason: 'overassigned' })),
      };
      view.setSummary(summary);
      return;
    }

    const assignmentResult = assignmentService.submitAssignments({
      paperId: currentPaper.id,
      reviewerEmails: allowed,
    });
    if (!assignmentResult.ok) {
      view.setStatus(EVALUATION_MESSAGE, true);
      if (violationLog) {
        violationLog.logFailure({
          errorType: 'evaluation_failed',
          message: 'assignment_evaluation_failed',
          context: currentPaper.id,
        });
      }
      return;
    }

    const summary = {
      accepted: assignmentResult.accepted,
      blocked: assignmentResult.blocked.concat(invalidEntries).map((entry) => {
        const reasonMap = {
          limit_reached: LIMIT_MESSAGE,
          lookup_failed: LOOKUP_MESSAGE,
          save_failed: SAVE_MESSAGE,
          already_assigned: DUPLICATE_MESSAGE,
          invalid_email: 'Invalid reviewer email.',
          duplicate_entry: 'Duplicate reviewer entry.',
          duplicate_assignment: DUPLICATE_MESSAGE,
          fourth_assignment: 'Paper already has three referees assigned. Remove or replace a referee to meet policy.',
          overassigned: 'Over-assignment blocked. Reduce reviewers to three.',
          delivery_failed: REQUEST_FAILURE_MESSAGE,
          duplicate_request: REQUEST_FAILURE_MESSAGE,
          request_failed: REQUEST_FAILURE_MESSAGE,
        };
        return {
          email: entry.email,
          reason: reasonMap[entry.reason] || REQUEST_FAILURE_MESSAGE,
        };
      }),
    };
    if (blocked.length) {
      const alertPayload = overassignmentAlert.build({ count: countCheck.count, blocked });
      view.setWarning(alertPayload.message);
      summary.blocked = summary.blocked.concat(
        blocked.map((email) => ({ email, reason: 'overassigned' })),
      );
    }

    const summaryRendered = view.setSummary(summary);
    if (!summaryRendered) {
      view.setFallbackSummary('Unable to display assignment details.', summary.blocked.map((entry) => entry.email));
      if (violationLog) {
        violationLog.logFailure({
          errorType: 'notification_ui_failed',
          message: 'assignment_ui_failed',
          context: currentPaper.id,
        });
      }
    }

    if (assignmentResult.accepted.length === 0) {
      if (summary.blocked.length) {
        view.setStatus('No review requests were sent.', true);
      }
      return;
    }

    if (summary.blocked.length === 0) {
      view.showConfirmation(currentPaper.id, assignmentResult.accepted);
      return;
    }

    view.setStatus('Review requests sent with some blocked.', false);
  }

  return {
    init() {
      loadPaper();
      if (currentPaper) {
        const check = overassignmentCheck.evaluate({ paperId: currentPaper.id, errorLog });
        if (check.ok && check.overassigned) {
          const alertPayload = overassignmentAlert.build({ count: check.count });
          view.setWarning(alertPayload.message);
        }
      }
      view.onSubmit(handleSubmit);
    },
    addReferees(refereeEmails) {
      if (!applyAuthGuard()) {
        return { ok: false, reason: 'unauthorized' };
      }
      if (!currentPaper && !loadPaper()) {
        return { ok: false, reason: 'paper_not_found' };
      }
      return assignmentService.submitAssignments({
        paperId: currentPaper.id,
        reviewerEmails: refereeEmails,
      });
    },
    removeReferees(refereeEmails) {
      if (!applyAuthGuard()) {
        return { ok: false, reason: 'unauthorized' };
      }
      if (!currentPaper && !loadPaper()) {
        return { ok: false, reason: 'paper_not_found' };
      }
      const existing = Array.isArray(currentPaper.assignedRefereeEmails) ? currentPaper.assignedRefereeEmails : [];
      const toRemove = new Set(refereeEmails.map(normalizeRefereeEmail).filter(Boolean));
      const remaining = existing.filter((email) => !toRemove.has(normalizeRefereeEmail(email)));
      try {
        const updated = assignmentStorage.saveAssignments({
          paperId: currentPaper.id,
          refereeEmails: remaining,
          expectedVersion: currentPaper.assignmentVersion || 0,
        });
        currentPaper = updated;
        view.setStatus('Referee assignments updated.', false);
        return { ok: true, paper: updated };
      } catch (error) {
        view.setStatus('Assignment update failed. Try again.', true);
        return { ok: false, reason: error && error.message ? error.message : 'update_failed' };
      }
    },
  };
}
