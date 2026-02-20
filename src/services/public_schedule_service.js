import { scheduleRepository as defaultScheduleRepository } from './schedule_repository.js';
import { submissionStorage as defaultSubmissionStorage } from './submission-storage.js';
import { createPublicSchedule } from '../models/public_schedule.js';

function parseAuthors(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }
  if (typeof value === 'string') {
    return value.split(',').map((name) => name.trim()).filter(Boolean);
  }
  return [];
}

function formatDay(startTime) {
  if (!startTime) {
    return 'TBD day';
  }
  const parsed = Date.parse(startTime);
  if (Number.isNaN(parsed)) {
    return 'TBD day';
  }
  return new Date(parsed).toISOString().slice(0, 10);
}

function formatTimeRange(startTime, endTime) {
  if (!startTime || !endTime) {
    return 'TBD time';
  }
  return `${startTime} - ${endTime}`;
}

function resolveSession(item) {
  const safe = item;
  return safe.session
    || safe.sessionLabel
    || safe.track
    || safe.trackLabel
    || 'Session';
}

function isUnscheduledEntry(item) {
  const safe = item;
  if (safe.isUnscheduled || safe.status === 'unscheduled') {
    return true;
  }
  if (!safe.startTime || !safe.endTime) {
    return true;
  }
  if (!safe.roomName && !safe.roomId) {
    return true;
  }
  return false;
}

export const publicScheduleService = {
  getPublicSchedule({
    conferenceId,
    scheduleRepository = defaultScheduleRepository,
    submissionStorage = defaultSubmissionStorage,
  } = {}) {
    const schedule = scheduleRepository.getSchedule(conferenceId);
    if (!schedule || schedule.status !== 'published') {
      return { ok: false, reason: 'not_published' };
    }
    const items = scheduleRepository.getScheduleItems(schedule.scheduleId);
    const manuscripts = submissionStorage.getManuscripts();
    const manuscriptMap = new Map(manuscripts.map((manuscript) => [manuscript.id, manuscript]));
    const entries = [];
    const unscheduled = [];

    (Array.isArray(items) ? items : []).forEach((item) => {
      if (!item) {
        return;
      }
      const paperId = item.paperId || item.id;
      const manuscript = manuscriptMap.get(paperId);
      const title = item.paperTitle || (manuscript && manuscript.title) || 'Untitled paper';
      const authors = parseAuthors(
        item.authors
          || item.authorNames
          || (manuscript && manuscript.authorNames),
      );
      const abstract = item.abstract || (manuscript && manuscript.abstract) || '';
      const entry = {
        id: item.entryId || item.itemId || paperId || null,
        paperId,
        day: formatDay(item.startTime),
        time: formatTimeRange(item.startTime, item.endTime),
        room: item.roomName || item.roomId || 'TBD room',
        session: resolveSession(item),
        paperTitle: title,
        authors,
        abstract,
        isUnscheduled: isUnscheduledEntry(item),
      };
      if (entry.isUnscheduled) {
        unscheduled.push(entry);
      } else {
        entries.push(entry);
      }
    });

    return {
      ok: true,
      schedule: createPublicSchedule({
        status: 'published',
        publishedAt: schedule.publishedAt || null,
        lastUpdatedAt: schedule.updatedAt || schedule.publishedAt || null,
        entries: entries.concat(unscheduled),
      }),
      entries,
      unscheduled,
      lastUpdatedAt: schedule.updatedAt || schedule.publishedAt || null,
    };
  },
};
