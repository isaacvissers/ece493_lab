import { UI_MESSAGES } from '../services/ui-messages.js';
import { validateRefereeEmails } from '../models/referee-assignment.js';
import { isEligibleStatus } from '../models/paper.js';
import { assignmentService as defaultAssignmentService } from '../services/assignment-service.js';
import { assignmentStore as defaultAssignmentStore } from '../services/assignment-store.js';

const AUTH_MESSAGE = 'You do not have permission to assign referees.';
const COUNT_MESSAGE = 'Exactly 3 referees are required.';
const INELIGIBLE_MESSAGE = 'Paper is not eligible for assignment.';
const CONCURRENT_MESSAGE = 'Assignment changed. Refresh this paper to continue.';
const NOTIFICATION_WARNING = 'Notifications failed to send to all referees.';
const ASSIGNMENT_UNAVAILABLE = 'Assignment is temporarily unavailable. Try again later.';
const LIMIT_MESSAGE = 'Reviewer has reached the maximum of 5 active assignments.';
const LOOKUP_MESSAGE = 'Reviewer assignment count could not be determined.';
const SAVE_MESSAGE = 'Assignment could not be saved. Try again.';
const DUPLICATE_MESSAGE = 'Reviewer is already assigned to this paper.';

export function createRefereeAssignmentController({
  view,
  assignmentStorage,
  notificationService,
  assignmentErrorLog,
  sessionState,
  paperId,
  onAuthRequired,
  assignmentService = defaultAssignmentService,
  assignmentStore = defaultAssignmentStore,
}) {
  let currentPaper = null;

  function isEditor(user) {
    if (!user || !user.role) {
      return false;
    }
    return user.role.toLowerCase() === 'editor';
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
    const validation = validateRefereeEmails(rawEmails, currentPaper.assignedRefereeEmails || []);

    validation.blanks.forEach((index) => {
      view.setFieldError(index, 'Referee email is required.');
    });
    validation.invalid.forEach((index) => {
      view.setFieldError(index, 'Referee email format is invalid.');
    });
    validation.duplicates.forEach((index) => {
      view.setFieldError(index, 'Duplicate referee email.');
    });
    if (validation.uniqueEmails.length !== 3) {
      view.setCountError(COUNT_MESSAGE);
    }

    if (!validation.ok) {
      view.setStatus('Please fix the errors before assigning referees.', true);
      return;
    }

    const assignmentResult = assignmentService.assignReviewers({
      paperId: currentPaper.id,
      reviewerEmails: validation.uniqueEmails,
    });
    const summary = {
      assigned: assignmentResult.assigned,
      rejected: assignmentResult.rejected.map((entry) => {
        const reasonMap = {
          limit_reached: LIMIT_MESSAGE,
          lookup_failed: LOOKUP_MESSAGE,
          save_failed: SAVE_MESSAGE,
          already_assigned: DUPLICATE_MESSAGE,
        };
        return {
          email: entry.email,
          reason: reasonMap[entry.reason] || SAVE_MESSAGE,
        };
      }),
    };
    view.setSummary(summary);

    if (assignmentResult.assigned.length === 0) {
      if (summary.rejected.length) {
        view.setStatus('No reviewers were assigned.', true);
      }
      return;
    }

    let updatedPaper = null;
    try {
      updatedPaper = assignmentStorage.saveAssignments({
        paperId: currentPaper.id,
        refereeEmails: assignmentResult.assigned,
        expectedVersion: currentPaper.assignmentVersion || 0,
      });
    } catch (error) {
      const errorType = error && error.message ? error.message : 'unknown';
      if (assignmentErrorLog) {
        assignmentErrorLog.logFailure({
          errorType,
          message: 'assignment_save_failed',
          context: currentPaper.id,
        });
      }
      if (errorType === 'concurrent_change') {
        view.setStatus(CONCURRENT_MESSAGE, true);
        assignmentStore.removeAssignments({
          paperId: currentPaper.id,
          reviewerEmails: assignmentResult.assigned,
        });
        return;
      }
      if (errorType === 'paper_ineligible') {
        view.setStatus(INELIGIBLE_MESSAGE, true);
        assignmentStore.removeAssignments({
          paperId: currentPaper.id,
          reviewerEmails: assignmentResult.assigned,
        });
        return;
      }
      view.setStatus(ASSIGNMENT_UNAVAILABLE, true);
      assignmentStore.removeAssignments({
        paperId: currentPaper.id,
        reviewerEmails: assignmentResult.assigned,
      });
      return;
    }

    currentPaper = updatedPaper;
    const notificationResult = notificationService.sendNotifications(currentPaper.id, assignmentResult.assigned);
    if (!notificationResult.ok) {
      view.setWarning(NOTIFICATION_WARNING);
      if (assignmentErrorLog) {
        assignmentErrorLog.logFailure({
          errorType: 'notification_failed',
          message: 'notification_failed',
          context: currentPaper.id,
        });
      }
    }

    if (assignmentResult.rejected.length === 0) {
      view.showConfirmation(currentPaper.id, assignmentResult.assigned);
    } else {
      view.setStatus('Assignments processed with some rejections.', false);
    }
  }

  return {
    init() {
      loadPaper();
      view.onSubmit(handleSubmit);
    },
  };
}
