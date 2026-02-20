import { scheduleRepository, __test__ } from '../../src/services/schedule_repository.js';

function reset() {
  scheduleRepository.reset();
}

beforeEach(() => {
  reset();
});

test('stores and retrieves conferences', () => {
  const conference = { conferenceId: 'conf_1', dateRange: { start: '2026-05-01', end: '2026-05-02' } };
  scheduleRepository.saveConference(conference);
  expect(scheduleRepository.getConference('conf_1')).toMatchObject(conference);
  const updated = { ...conference, dateRange: { start: '2026-05-03', end: '2026-05-04' } };
  scheduleRepository.saveConference(updated);
  expect(scheduleRepository.getConference('conf_1')).toMatchObject(updated);
  expect(scheduleRepository.getConference('missing')).toBeNull();
});

test('stores and filters accepted papers by conference', () => {
  scheduleRepository.savePapers([
    { paperId: 'p1', conferenceId: 'conf_1', status: 'accepted' },
    { paperId: 'p2', conferenceId: 'conf_2', status: 'accepted' },
    { paperId: 'p3', conferenceId: 'conf_1', status: 'rejected' },
  ]);
  const accepted = scheduleRepository.getAcceptedPapers('conf_1');
  expect(accepted.map((paper) => paper.paperId)).toEqual(['p1']);
  const allAccepted = scheduleRepository.getAcceptedPapers();
  expect(allAccepted.length).toBe(2);
});

test('saves draft schedules with items', () => {
  const schedule = scheduleRepository.saveDraft({
    conferenceId: 'conf_1',
    items: [{ paperId: 'p1', status: 'scheduled' }],
  });
  const stored = scheduleRepository.getSchedule('conf_1');
  expect(stored.scheduleId).toBe(schedule.scheduleId);
  const items = scheduleRepository.getScheduleItems(schedule.scheduleId);
  expect(items.length).toBe(1);
  expect(items[0].scheduleId).toBe(schedule.scheduleId);

  const updated = scheduleRepository.saveDraft({
    conferenceId: 'conf_1',
    items: [{ paperId: 'p2', status: 'scheduled' }],
  });
  const refreshed = scheduleRepository.getScheduleItems(updated.scheduleId);
  expect(refreshed.length).toBe(1);
  expect(refreshed[0].paperId).toBe('p2');
});

test('saves drafts with default items and timestamps', () => {
  const schedule = scheduleRepository.saveDraft({ conferenceId: 'conf_defaults' });
  const items = scheduleRepository.getScheduleItems(schedule.scheduleId);
  expect(items).toEqual([]);
});

test('saveDraft handles empty input object', () => {
  const schedule = scheduleRepository.saveDraft();
  expect(scheduleRepository.getSchedule(schedule.conferenceId)).toMatchObject(schedule);
});

test('updates schedule status on save and publish', () => {
  scheduleRepository.saveDraft({ conferenceId: 'conf_1', items: [] });
  const saved = scheduleRepository.saveSchedule({ conferenceId: 'conf_1' });
  expect(saved.status).toBe('saved');
  const published = scheduleRepository.publishSchedule({ conferenceId: 'conf_1' });
  expect(published.status).toBe('published');
});

test('throws when schedule missing', () => {
  expect(() => scheduleRepository.saveSchedule({ conferenceId: 'missing' })).toThrow('schedule_not_found');
  expect(() => scheduleRepository.saveSchedule()).toThrow('schedule_not_found');
  expect(() => scheduleRepository.publishSchedule()).toThrow('schedule_not_found');
});

test('failure mode blocks writes', () => {
  scheduleRepository.saveDraft({ conferenceId: 'conf_fail', items: [] });
  scheduleRepository.setFailureMode(true);
  expect(() => scheduleRepository.saveConference({ conferenceId: 'conf_fail' })).toThrow('schedule_storage_failure');
  expect(() => scheduleRepository.addPaper({ paperId: 'p1' })).toThrow('schedule_storage_failure');
  expect(() => scheduleRepository.saveSchedule({ conferenceId: 'conf_fail' })).toThrow('schedule_storage_failure');
  expect(() => __test__.persistItems([])).toThrow('schedule_storage_failure');
  expect(() => __test__.persistSchedules([])).toThrow('schedule_storage_failure');
  expect(() => __test__.persistPapers([])).toThrow('schedule_storage_failure');
  expect(() => __test__.persistConferences([])).toThrow('schedule_storage_failure');
  scheduleRepository.setFailureMode(false);
});

test('savePapers handles non-array input', () => {
  scheduleRepository.savePapers('not-an-array');
  expect(scheduleRepository.getAcceptedPapers()).toEqual([]);
  scheduleRepository.savePapers();
  expect(scheduleRepository.getAcceptedPapers()).toEqual([]);
});
