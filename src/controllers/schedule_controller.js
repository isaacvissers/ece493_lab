import { createConference } from '../models/conference.js';
import { createRoom } from '../models/room.js';
import { authService as defaultAuthService } from '../services/auth_service.js';
import { accessControl as defaultAccessControl } from '../services/access_control.js';
import { scheduleRepository as defaultScheduleRepository } from '../services/schedule_repository.js';
import { scheduleGenerator as defaultScheduleGenerator } from '../services/schedule_generator.js';
import { scheduleValidation as defaultScheduleValidation } from '../services/schedule_validation.js';
import { auditLogService as defaultAuditLogService } from '../services/audit_log_service.js';
import { notificationService as defaultNotificationService } from '../services/notification_service.js';
import { publicationLogService as defaultPublicationLogService } from '../services/publication_log_service.js';

const ACCESS_DENIED_MESSAGE = 'You do not have permission to generate schedules.';

export function createScheduleController({
  view,
  sessionState,
  authService = defaultAuthService,
  accessControl = defaultAccessControl,
  scheduleRepository = defaultScheduleRepository,
  scheduleGenerator = defaultScheduleGenerator,
  scheduleValidation = defaultScheduleValidation,
  auditLogService = defaultAuditLogService,
  notificationService = defaultNotificationService,
  publicationLogService = defaultPublicationLogService,
  onAuthRequired = null,
} = {}) {
  function requireAuth() {
    return authService.requireAuth({ sessionState, onAuthRequired });
  }

  function isAuthorized() {
    const auth = requireAuth();
    if (!auth.ok) {
      return { ok: false, reason: 'unauthenticated' };
    }
    const user = auth.user;
    if (!accessControl.isAdmin(user)) {
      auditLogService.log({ eventType: 'access_denied', relatedId: 'schedule', details: { userId: user && user.id } });
      return { ok: false, reason: 'forbidden' };
    }
    return { ok: true, user };
  }

  function setValidationErrors(errors = {}) {
    Object.entries(errors).forEach(([field, code]) => {
      const message = code === 'required'
        ? 'This field is required.'
        : 'Enter a valid value.';
      view.setFieldError(field, message);
    });
  }

  function buildConference(values) {
    const rooms = values.rooms.map((room, index) => createRoom({
      roomId: room.name || `room_${index + 1}`,
      name: room.name,
      capacity: room.capacity,
    }));
    return createConference({
      conferenceId: values.conferenceId,
      dateRange: values.dateRange,
      rooms,
      slotDurationMinutes: values.slotDurationMinutes,
    });
  }

  function handleGenerate(event) {
    event.preventDefault();
    view.clearErrors();
    const auth = isAuthorized();
    if (!auth.ok) {
      view.setStatus(ACCESS_DENIED_MESSAGE, true);
      view.setEditable(false);
      return;
    }
    const values = view.getValues();
    const validation = scheduleValidation.validateInputs(values);
    if (!validation.ok) {
      setValidationErrors(validation.errors);
      view.setStatus('Fix highlighted scheduling inputs before generating.', true);
      return;
    }

    const conference = buildConference(validation.values);
    scheduleRepository.saveConference(conference);
    const papers = scheduleRepository.getAcceptedPapers(conference.conferenceId);
    const result = scheduleGenerator.generate({ conference, papers });
    if (!result.ok) {
      const message = result.reason === 'conflict'
        ? 'Scheduling conflicts detected. Adjust inputs and try again.'
        : (result.reason === 'generation_timeout'
          ? 'Schedule generation took too long. Adjust inputs and try again.'
          : 'Unable to generate schedule with provided inputs.');
      view.setStatus(message, true);
      return;
    }

    const scheduled = result.items || [];
    const unscheduled = result.unscheduled || [];
    scheduleRepository.saveDraft({
      conferenceId: conference.conferenceId,
      items: scheduled.concat(unscheduled),
    });
    const summary = `Scheduled ${scheduled.length} of ${result.totalAccepted} accepted papers.`;
    view.setDraft({ scheduled, unscheduled, summary });
    if (!papers.length) {
      view.setStatus('No accepted papers available. Draft created with no assignments.', false);
      return;
    }
    if (unscheduled.length) {
      view.setStatus('Draft created with unscheduled papers flagged.', true);
      return;
    }
    view.setStatus('Draft schedule generated successfully.', false);
  }

  function handleSave() {
    view.clearErrors();
    const auth = isAuthorized();
    if (!auth.ok) {
      view.setStatus(ACCESS_DENIED_MESSAGE, true);
      view.setEditable(false);
      return;
    }
    const conferenceId = (view.getValues().conferenceId || '').trim();
    if (!conferenceId) {
      view.setStatus('Enter a conference ID before saving.', true);
      return;
    }
    try {
      scheduleRepository.saveSchedule({ conferenceId });
      view.setStatus('Draft schedule saved.', false);
    } catch (error) {
      auditLogService.log({
        eventType: 'schedule_save_failed',
        relatedId: conferenceId,
        details: { message: error && error.message ? error.message : 'save_failed' },
      });
      view.setStatus('Save failed. Try again.', true);
    }
  }

  function handlePublish() {
    view.clearErrors();
    const auth = isAuthorized();
    if (!auth.ok) {
      view.setStatus(ACCESS_DENIED_MESSAGE, true);
      view.setEditable(false);
      return;
    }
    const conferenceId = (view.getValues().conferenceId || '').trim();
    if (!conferenceId) {
      view.setStatus('Enter a conference ID before publishing.', true);
      return;
    }
    try {
      const published = scheduleRepository.publishSchedule({ conferenceId });
      if (notificationService && notificationService.sendFinalScheduleNotifications) {
        try {
          const papers = scheduleRepository.getAcceptedPapers(conferenceId);
          notificationService.sendFinalScheduleNotifications({
            schedule: published,
            papers,
            auditLogService,
          });
        } catch (error) {
          auditLogService.log({
            eventType: 'schedule_notification_failed',
            relatedId: conferenceId,
            details: { message: error && error.message ? error.message : 'notification_failed' },
          });
        }
      }
      view.setStatus('Schedule published.', false);
    } catch (error) {
      if (publicationLogService) {
        publicationLogService.logFailure({
          context: 'publish',
          errorMessage: error && error.message ? error.message : 'publish_failed',
          relatedId: conferenceId,
        });
      }
      auditLogService.log({
        eventType: 'schedule_publish_failed',
        relatedId: conferenceId,
        details: { message: error && error.message ? error.message : 'publish_failed' },
      });
      view.setStatus('Publish failed. Saved schedule remains intact.', true);
    }
  }

  function loadDraft(conferenceId) {
    const schedule = scheduleRepository.getSchedule(conferenceId);
    if (!schedule) {
      return { ok: false, reason: 'not_found' };
    }
    const items = scheduleRepository.getScheduleItems(schedule.scheduleId);
    const scheduled = items.filter((item) => item.status === 'scheduled');
    const unscheduled = items.filter((item) => item.status !== 'scheduled');
    const summary = `Scheduled ${scheduled.length} papers.`;
    view.setDraft({ scheduled, unscheduled, summary });
    return { ok: true, schedule, items };
  }

  return {
    view,
    init() {
      view.onGenerate(handleGenerate);
      view.onSave(handleSave);
      view.onPublish(handlePublish);
    },
    generate: handleGenerate,
    save: handleSave,
    publish: handlePublish,
    loadDraft,
  };
}
