import { authService as defaultAuthService } from '../services/auth_service.js';
import { scheduleService as defaultScheduleService } from '../services/schedule_service.js';
import { auditLogService as defaultAuditLogService } from '../services/audit_log_service.js';
import { notificationService as defaultNotificationService } from '../services/notification_service.js';

const ACCESS_DENIED_MESSAGE = 'Access denied.';
const NO_SCHEDULE_MESSAGE = 'No schedule available.';

export function createScheduleEditController({
  view,
  sessionState,
  authService = defaultAuthService,
  scheduleService = defaultScheduleService,
  auditLogService = defaultAuditLogService,
  notificationService = defaultNotificationService,
  onAuthRequired = null,
} = {}) {
  function requireAuth() {
    return authService.requireAuth({ sessionState, onAuthRequired });
  }

  function isAuthorized(conferenceId) {
    const auth = requireAuth();
    if (!auth.ok) {
      return { ok: false, reason: 'unauthenticated' };
    }
    if (!authService.isAdminOrEditor(auth.user)) {
      auditLogService.logScheduleEditDenied({
        conferenceId,
        userId: auth.user ? auth.user.id || auth.user.userId : null,
      });
      return { ok: false, reason: 'forbidden', user: auth.user };
    }
    return { ok: true, user: auth.user };
  }

  function setErrorsFromMissing(values) {
    if (!values.conferenceId) {
      view.setFieldError('conferenceId', 'This field is required.');
    }
    if (!values.entryId) {
      view.setFieldError('entryId', 'This field is required.');
    }
    if (!values.scheduleVersion) {
      view.setFieldError('scheduleVersion', 'This field is required.');
    }
  }

  function show(conferenceId) {
    view.clearErrors();
    view.setStatus('', false);
    const auth = isAuthorized(conferenceId);
    if (!auth.ok) {
      view.setStatus(ACCESS_DENIED_MESSAGE, true);
      view.setEditable(false);
      return;
    }

    const draft = scheduleService.getDraftSchedule(conferenceId);
    if (!draft) {
      view.setStatus(NO_SCHEDULE_MESSAGE, true);
      view.setEditable(false);
      view.setDraft({ entries: [], summary: '' });
      return;
    }
    const summary = `Draft schedule version ${draft.schedule.version || 1}.`;
    view.setDraft({ entries: draft.entries, summary });
    view.setVersion(draft.schedule.version || 1);
    view.setEditable(true);
  }

  function save(event) {
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    view.clearErrors();
    const values = view.getValues();
    const auth = isAuthorized(values.conferenceId);
    if (!auth.ok) {
      view.setStatus(ACCESS_DENIED_MESSAGE, true);
      view.setEditable(false);
      return;
    }

    const scheduleVersion = Number(values.scheduleVersion);
    const missing = !values.conferenceId
      || !values.entryId
      || !values.scheduleVersion;
    if (missing) {
      setErrorsFromMissing(values);
      view.setStatus('Complete all fields before saving.', true);
      return;
    }
    if (!Number.isFinite(scheduleVersion) || scheduleVersion <= 0) {
      view.setFieldError('scheduleVersion', 'Enter a valid schedule version.');
      view.setStatus('Complete all fields before saving.', true);
      return;
    }

    const result = scheduleService.updateScheduleEntry({
      conferenceId: values.conferenceId,
      entryId: values.entryId,
      roomId: values.roomId,
      startTime: values.startTime,
      endTime: values.endTime,
      scheduleVersion,
      auditLogService,
      notificationService,
    });

    if (!result.ok) {
      if (result.reason === 'not_found') {
        view.setStatus(NO_SCHEDULE_MESSAGE, true);
        view.setEditable(false);
        return;
      }
      if (result.reason === 'conflict') {
        const conflictId = result.conflictEntry
          ? (result.conflictEntry.entryId || result.conflictEntry.itemId)
          : 'another entry';
        view.setStatus(`Conflict detected with ${conflictId}.`, true);
        return;
      }
      if (result.reason === 'outside_window') {
        view.setStatus('Selected time is outside the conference window.', true);
        return;
      }
      if (result.reason === 'unscheduled') {
        view.setStatus('Entries must remain scheduled with room and time.', true);
        return;
      }
      if (result.reason === 'invalid_time') {
        view.setStatus('Enter a valid time range.', true);
        return;
      }
      if (result.reason === 'duplicate_paper') {
        view.setStatus('Paper is already scheduled elsewhere.', true);
        return;
      }
      if (result.reason === 'version_conflict') {
        view.setStatus('Schedule updated by another editor. Refresh before saving.', true);
        return;
      }
      if (result.reason === 'save_failed') {
        view.setStatus('Save failed. Try again.', true);
        return;
      }
      view.setStatus('Unable to save schedule update.', true);
      return;
    }

    view.setStatus('Schedule update saved.', false);
    if (result.entries) {
      const summary = `Draft schedule version ${result.schedule.version}.`;
      view.setDraft({ entries: result.entries, summary });
      view.setVersion(result.schedule.version);
    }
  }

  return {
    view,
    init() {
      view.onSave(save);
    },
    show,
    save,
  };
}
