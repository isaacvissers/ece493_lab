import { authService as defaultAuthService } from '../services/auth_service.js';
import { scheduleService as defaultScheduleService } from '../services/schedule_service.js';

const ACCESS_DENIED_MESSAGE = 'Access denied.';
const PENDING_MESSAGE = 'Schedule not available yet.';

export function createAuthorScheduleController({
  view,
  sessionState,
  authService = defaultAuthService,
  scheduleService = defaultScheduleService,
  onAuthRequired = null,
} = {}) {
  let pendingConferenceId = null;

  function requireAuth() {
    return authService.requireAuth({ sessionState, onAuthRequired });
  }

  function getAuthorId(user) {
    const resolved = user || (sessionState && sessionState.getCurrentUser ? sessionState.getCurrentUser() : null);
    if (!resolved) {
      return null;
    }
    return resolved.id || resolved.authorId || resolved.userId || resolved.email || null;
  }

  function show(conferenceId) {
    view.setStatus('', false);
    const auth = requireAuth();
    if (!auth.ok) {
      pendingConferenceId = conferenceId;
      return;
    }
    const authorId = getAuthorId(auth.user);
    const result = scheduleService.getPublishedScheduleForAuthor({ conferenceId, authorId });
    if (!result.ok) {
      if (result.reason === 'not_published') {
        view.setPending(PENDING_MESSAGE);
        return;
      }
      view.setStatus(ACCESS_DENIED_MESSAGE, true);
      return;
    }
    pendingConferenceId = null;
    const summaryText = result.schedule && result.schedule.publishedAt
      ? `Published ${result.schedule.publishedAt}.`
      : 'Published schedule available.';
    view.setSchedule({
      scheduled: result.scheduled,
      unscheduled: result.unscheduled,
      summaryText,
    });
  }

  return {
    view,
    show,
    resumePending() {
      if (!pendingConferenceId) {
        return;
      }
      const conferenceId = pendingConferenceId;
      pendingConferenceId = null;
      show(conferenceId);
    },
  };
}
