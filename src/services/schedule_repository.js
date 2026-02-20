import { scheduleStorage } from './storage.js';
import { createSchedule } from '../models/schedule.js';

const CONFERENCES_KEY = 'cms.schedule_conferences';
const PAPERS_KEY = 'cms.schedule_papers';
const SCHEDULES_KEY = 'cms.schedules';
const ITEMS_KEY = 'cms.schedule_items';

let failureMode = false;

function loadConferences() {
  return scheduleStorage.read(CONFERENCES_KEY, []);
}

function persistConferences(conferences) {
  if (failureMode) {
    throw new Error('schedule_storage_failure');
  }
  scheduleStorage.write(CONFERENCES_KEY, conferences);
}

function loadPapers() {
  return scheduleStorage.read(PAPERS_KEY, []);
}

function persistPapers(papers) {
  if (failureMode) {
    throw new Error('schedule_storage_failure');
  }
  scheduleStorage.write(PAPERS_KEY, papers);
}

function loadSchedules() {
  return scheduleStorage.read(SCHEDULES_KEY, []);
}

function persistSchedules(schedules) {
  if (failureMode) {
    throw new Error('schedule_storage_failure');
  }
  scheduleStorage.write(SCHEDULES_KEY, schedules);
}

function loadItems() {
  return scheduleStorage.read(ITEMS_KEY, []);
}

function persistItems(items) {
  if (failureMode) {
    throw new Error('schedule_storage_failure');
  }
  scheduleStorage.write(ITEMS_KEY, items);
}

function findScheduleIndex(schedules, conferenceId) {
  return schedules.findIndex((schedule) => schedule.conferenceId === conferenceId);
}

export const scheduleRepository = {
  setFailureMode(enabled) {
    failureMode = Boolean(enabled);
  },
  reset() {
    failureMode = false;
    scheduleStorage.remove(CONFERENCES_KEY);
    scheduleStorage.remove(PAPERS_KEY);
    scheduleStorage.remove(SCHEDULES_KEY);
    scheduleStorage.remove(ITEMS_KEY);
  },
  saveConference(conference) {
    const conferences = loadConferences().slice();
    const index = conferences.findIndex((entry) => entry.conferenceId === conference.conferenceId);
    if (index === -1) {
      conferences.push(conference);
    } else {
      conferences[index] = conference;
    }
    persistConferences(conferences);
    return conference;
  },
  getConference(conferenceId) {
    return loadConferences().find((entry) => entry.conferenceId === conferenceId) || null;
  },
  savePapers(papers = []) {
    persistPapers(Array.isArray(papers) ? papers.slice() : []);
  },
  addPaper(paper) {
    const papers = loadPapers().slice();
    papers.push(paper);
    persistPapers(papers);
  },
  getAcceptedPapers(conferenceId) {
    return loadPapers().filter((paper) => (
      paper
      && paper.status === 'accepted'
      && (!conferenceId || paper.conferenceId === conferenceId)
    ));
  },
  getSchedule(conferenceId) {
    return loadSchedules().find((schedule) => schedule.conferenceId === conferenceId) || null;
  },
  getScheduleItems(scheduleId) {
    return loadItems().filter((item) => item.scheduleId === scheduleId);
  },
  saveDraft({
    conferenceId,
    items = [],
    version = null,
    now = new Date().toISOString(),
  } = {}) {
    const schedules = loadSchedules().slice();
    const index = findScheduleIndex(schedules, conferenceId);
    let schedule;
    if (index === -1) {
      schedule = createSchedule({
        conferenceId,
        status: 'draft',
        createdAt: now,
        updatedAt: now,
        version: Number.isFinite(version) ? version : undefined,
      });
      schedules.push(schedule);
    } else {
      schedule = {
        ...schedules[index],
        status: 'draft',
        updatedAt: now,
        version: Number.isFinite(version)
          ? version
          : (Number.isFinite(schedules[index].version) ? schedules[index].version : 1),
      };
      schedules[index] = schedule;
    }
    persistSchedules(schedules);

    const existingItems = loadItems().filter((item) => item.scheduleId !== schedule.scheduleId);
    const nextItems = existingItems.concat(items.map((item) => ({
      ...item,
      scheduleId: schedule.scheduleId,
    })));
    persistItems(nextItems);
    return schedule;
  },
  saveSchedule({ conferenceId, status = 'saved', now = new Date().toISOString() } = {}) {
    const schedules = loadSchedules().slice();
    const index = findScheduleIndex(schedules, conferenceId);
    if (index === -1) {
      throw new Error('schedule_not_found');
    }
    const schedule = { ...schedules[index], status, updatedAt: now };
    schedules[index] = schedule;
    persistSchedules(schedules);
    return schedule;
  },
  publishSchedule({ conferenceId, now = new Date().toISOString() } = {}) {
    return scheduleRepository.saveSchedule({ conferenceId, status: 'published', now });
  },
};

export const __test__ = {
  persistConferences,
  persistPapers,
  persistSchedules,
  persistItems,
};
