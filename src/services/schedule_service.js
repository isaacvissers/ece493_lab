import { scheduleRepository } from './schedule_repository.js';
import { scheduleValidationService as defaultScheduleValidationService } from './schedule_validation_service.js';
import { auditLogService as defaultAuditLogService } from './audit_log_service.js';
import { notificationService as defaultNotificationService } from './notification_service.js';
import { authorAccessService as defaultAuthorAccessService } from './author_access_service.js';

function isScheduledEntry(entry) {
  return entry
    && (entry.status === undefined || entry.status === 'scheduled')
    && (entry.roomName || entry.roomId)
    && entry.startTime
    && entry.endTime;
}

export const scheduleService = {
  getDraftSchedule(conferenceId) {
    const schedule = scheduleRepository.getSchedule(conferenceId);
    if (!schedule || schedule.status === 'published') {
      return null;
    }
    const entries = scheduleRepository.getScheduleItems(schedule.scheduleId);
    const conference = scheduleRepository.getConference(conferenceId);
    return { schedule, entries, conference };
  },
  getPublishedSchedule(conferenceId) {
    const schedule = scheduleRepository.getSchedule(conferenceId);
    if (!schedule || schedule.status !== 'published') {
      return null;
    }
    const items = scheduleRepository.getScheduleItems(schedule.scheduleId);
    return { schedule, items };
  },
  getPublishedScheduleForAuthor({
    conferenceId,
    authorId,
    authorAccessService = defaultAuthorAccessService,
  } = {}) {
    const access = authorAccessService.getAcceptedPapersForAuthor({ authorId, conferenceId });
    if (!access.ok) {
      return { ok: false, reason: access.reason || 'access_denied' };
    }
    const schedule = scheduleRepository.getSchedule(conferenceId);
    if (!schedule || schedule.status !== 'published') {
      return { ok: false, reason: 'not_published', papers: access.papers };
    }
    const entries = scheduleRepository.getScheduleItems(schedule.scheduleId);
    const scheduled = [];
    const unscheduled = [];

    access.papers.forEach((paper) => {
      const paperId = paper.paperId || paper.id;
      const match = entries.find((entry) => entry && entry.paperId === paperId);
      if (match && isScheduledEntry(match)) {
        scheduled.push({
          paperId,
          paperTitle: match.paperTitle || paper.title || 'Untitled paper',
          roomName: match.roomName || match.roomId,
          startTime: match.startTime,
          endTime: match.endTime,
        });
      } else {
        const reason = match && match.reason ? match.reason : null;
        unscheduled.push({
          paperId,
          paperTitle: paper.title || match?.paperTitle || 'Untitled paper',
          reason,
        });
      }
    });

    return { ok: true, schedule, scheduled, unscheduled };
  },
  updateScheduleEntry({
    conferenceId,
    entryId,
    roomId,
    startTime,
    endTime,
    scheduleVersion,
    scheduleValidationService = defaultScheduleValidationService,
    auditLogService = defaultAuditLogService,
    notificationService = defaultNotificationService,
    now = new Date().toISOString(),
  } = {}) {
    const schedule = scheduleRepository.getSchedule(conferenceId);
    if (!schedule || schedule.status === 'published') {
      return { ok: false, reason: 'not_found' };
    }
    const entries = scheduleRepository.getScheduleItems(schedule.scheduleId);
    const entry = entries.find((item) => item && (item.entryId === entryId || item.itemId === entryId));
    const conference = scheduleRepository.getConference(conferenceId);
    if (!entry) {
      return { ok: false, reason: 'not_found' };
    }

    const validation = scheduleValidationService.validateEdit({
      entry,
      updates: { roomId, startTime, endTime },
      entries,
      conference,
    });
    if (!validation.ok) {
      if (validation.reason === 'conflict') {
        auditLogService.logScheduleConflict({
          conferenceId,
          entryId,
          conflictEntryId: validation.conflictEntry && (validation.conflictEntry.entryId || validation.conflictEntry.itemId),
        });
      }
      return {
        ok: false,
        reason: validation.reason,
        conflictEntry: validation.conflictEntry || null,
        window: validation.window || null,
      };
    }

    if (Number.isFinite(scheduleVersion) && scheduleVersion !== schedule.version) {
      auditLogService.logScheduleConcurrency({
        conferenceId,
        expectedVersion: scheduleVersion,
        actualVersion: schedule.version,
      });
      return { ok: false, reason: 'version_conflict', schedule };
    }

    const updatedEntries = entries.map((item) => {
      if (!item) {
        return item;
      }
      const key = item.entryId || item.itemId;
      if (key !== entryId) {
        return item;
      }
      return validation.entry;
    });

    let updatedSchedule;
    try {
      updatedSchedule = scheduleRepository.saveDraft({
        conferenceId,
        items: updatedEntries,
        version: (schedule.version || 0) + 1,
        now,
      });
    } catch (error) {
      auditLogService.logScheduleEditFailed({
        conferenceId,
        entryId,
        message: error && error.message ? error.message : 'save_failed',
      });
      return { ok: false, reason: 'save_failed' };
    }

    const notificationResult = notificationService.triggerScheduleNotifications({
      schedule: updatedSchedule,
      entry: validation.entry,
    });
    if (!notificationResult.ok) {
      auditLogService.logScheduleNotificationFailed({
        conferenceId,
        entryId,
        message: notificationResult.reason || 'notification_failed',
      });
    }

    return { ok: true, schedule: updatedSchedule, entries: updatedEntries };
  },
};
