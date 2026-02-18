import { responseRecorder as defaultResponseRecorder } from '../services/response-recorder.js';
import { invitationLog as defaultInvitationLog } from '../services/invitation-log.js';

const INVALID_MESSAGE = 'Invitation link is invalid or expired.';
const DUPLICATE_MESSAGE = 'Response already recorded.';
const FAILURE_MESSAGE = 'Response could not be recorded. Please try again later.';

export function createReviewInvitationController({
  view,
  invitationId,
  decision,
  responseRecorder = defaultResponseRecorder,
  invitationLog = defaultInvitationLog,
} = {}) {
  function renderResult(result) {
    if (result.ok) {
      view.setStatus(`Response recorded: ${decision}.`, false);
      view.setDetail('Thank you for your response.');
      view.setActions([{ label: 'Close', href: '#', className: 'button secondary' }]);
      return;
    }

    if (result.reason === 'duplicate_response') {
      view.setStatus(DUPLICATE_MESSAGE, true);
      view.setDetail('A response was already recorded for this invitation.');
      return;
    }

    if (result.reason === 'invalid_decision') {
      view.setStatus('Invalid response option.', true);
      view.setDetail('Please use the accept or reject link in your invitation email.');
      return;
    }

    if (result.reason === 'not_found' || result.reason === 'expired') {
      view.setStatus(INVALID_MESSAGE, true);
      view.setDetail('Please request a new invitation from the editor.');
      return;
    }

    view.setStatus(FAILURE_MESSAGE, true);
    view.setDetail('Your response could not be saved.');
    if (invitationLog) {
      invitationLog.logFailure({
        errorType: 'record_failed',
        message: 'invitation_record_failed',
        context: invitationId,
      });
    }
  }

  return {
    init() {
      const result = responseRecorder.recordResponse({ invitationId, decision });
      renderResult(result);
    },
  };
}
