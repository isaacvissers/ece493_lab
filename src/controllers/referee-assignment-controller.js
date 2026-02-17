import { UI_MESSAGES } from '../services/ui-messages.js';
import { validateRefereeEmails } from '../models/referee-assignment.js';
import { isEligibleStatus } from '../models/paper.js';

const AUTH_MESSAGE = 'You do not have permission to assign referees.';
const COUNT_MESSAGE = 'Exactly 3 referees are required.';
const INELIGIBLE_MESSAGE = 'Paper is not eligible for assignment.';
const CONCURRENT_MESSAGE = 'Assignment changed. Refresh this paper to continue.';
const NOTIFICATION_WARNING = 'Notifications failed to send to all referees.';
const ASSIGNMENT_UNAVAILABLE = 'Assignment is temporarily unavailable. Try again later.';

export function createRefereeAssignmentController({
  view,
  assignmentStorage,
  notificationService,
  assignmentErrorLog,
  sessionState,
  paperId,
  onAuthRequired,
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

    let updatedPaper = null;
    try {
      updatedPaper = assignmentStorage.saveAssignments({
        paperId: currentPaper.id,
        refereeEmails: validation.uniqueEmails,
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
        return;
      }
      if (errorType === 'paper_ineligible') {
        view.setStatus(INELIGIBLE_MESSAGE, true);
        return;
      }
      view.setStatus(ASSIGNMENT_UNAVAILABLE, true);
      return;
    }

    currentPaper = updatedPaper;
    const notificationResult = notificationService.sendNotifications(currentPaper.id, validation.uniqueEmails);
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

    view.showConfirmation(currentPaper.id, validation.uniqueEmails);
  }

  return {
    init() {
      loadPaper();
      view.onSubmit(handleSubmit);
    },
  };
}
