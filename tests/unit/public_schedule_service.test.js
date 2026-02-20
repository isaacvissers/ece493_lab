import { publicScheduleService } from '../../src/services/public_schedule_service.js';
import { scheduleRepository } from '../../src/services/schedule_repository.js';
import { submissionStorage } from '../../src/services/submission-storage.js';

beforeEach(() => {
  scheduleRepository.reset();
  submissionStorage.reset();
});

test('returns not_published when schedule missing', () => {
  const result = publicScheduleService.getPublicSchedule({ conferenceId: 'conf_missing' });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('not_published');
});

test('returns not_published when called without arguments', () => {
  const result = publicScheduleService.getPublicSchedule();
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('not_published');
});

test('builds public schedule entries from published schedule', () => {
  submissionStorage.saveSubmission({
    id: 'paper_1',
    title: 'Public Paper',
    authorNames: 'Author One, Author Two',
    abstract: 'Public abstract.',
  });
  scheduleRepository.saveDraft({
    conferenceId: 'conf_pub',
    items: [
      {
        entryId: 'entry_1',
        paperId: 'paper_1',
        roomName: 'Room A',
        startTime: '2026-05-01T09:00:00.000Z',
        endTime: '2026-05-01T09:30:00.000Z',
        session: 'Track 1',
      },
    ],
  });
  scheduleRepository.publishSchedule({ conferenceId: 'conf_pub' });
  const result = publicScheduleService.getPublicSchedule({ conferenceId: 'conf_pub' });
  expect(result.ok).toBe(true);
  expect(result.entries).toHaveLength(1);
  expect(result.entries[0].day).toBe('2026-05-01');
  expect(result.entries[0].time).toContain('2026-05-01T09:00:00.000Z');
  expect(result.entries[0].room).toBe('Room A');
  expect(result.entries[0].session).toBe('Track 1');
  expect(result.entries[0].paperTitle).toBe('Public Paper');
  expect(result.entries[0].authors).toEqual(['Author One', 'Author Two']);
  expect(result.entries[0].abstract).toBe('Public abstract.');
});

test('places unscheduled items in unscheduled list', () => {
  scheduleRepository.saveDraft({
    conferenceId: 'conf_unscheduled',
    items: [
      {
        entryId: 'entry_unscheduled',
        paperId: 'paper_unscheduled',
        status: 'unscheduled',
      },
    ],
  });
  scheduleRepository.publishSchedule({ conferenceId: 'conf_unscheduled' });
  const result = publicScheduleService.getPublicSchedule({ conferenceId: 'conf_unscheduled' });
  expect(result.ok).toBe(true);
  expect(result.entries).toHaveLength(0);
  expect(result.unscheduled).toHaveLength(1);
  expect(result.unscheduled[0].isUnscheduled).toBe(true);
});

test('uses fallbacks when manuscript data missing', () => {
  scheduleRepository.saveDraft({
    conferenceId: 'conf_fallback',
    items: [
      {
        entryId: 'entry_fallback',
        paperId: 'paper_fallback',
        paperTitle: 'Fallback title',
        roomId: 'Room Z',
        startTime: '2026-05-02T09:00:00.000Z',
        endTime: '2026-05-02T09:30:00.000Z',
      },
    ],
  });
  scheduleRepository.publishSchedule({ conferenceId: 'conf_fallback' });
  const result = publicScheduleService.getPublicSchedule({ conferenceId: 'conf_fallback' });
  expect(result.ok).toBe(true);
  expect(result.entries[0].paperTitle).toBe('Fallback title');
  expect(result.entries[0].authors).toEqual([]);
});

test('handles invalid timestamps and missing session labels', () => {
  scheduleRepository.saveDraft({
    conferenceId: 'conf_invalid',
    items: [
      {
        entryId: 'entry_invalid',
        paperId: 'paper_invalid',
        roomId: 'Room X',
        startTime: 'invalid',
        endTime: null,
        authors: ['Author Array'],
      },
      {
        entryId: 'entry_missing_time',
        paperId: 'paper_missing_time',
        roomId: 'Room Y',
        startTime: null,
        endTime: null,
        authorNames: 'Author String',
      },
    ],
  });
  scheduleRepository.publishSchedule({ conferenceId: 'conf_invalid' });
  const result = publicScheduleService.getPublicSchedule({ conferenceId: 'conf_invalid' });
  expect(result.ok).toBe(true);
  expect(result.unscheduled).toHaveLength(2);
  expect(result.unscheduled[0].day).toBe('TBD day');
  expect(result.unscheduled[0].time).toBe('TBD time');
  expect(result.unscheduled[0].session).toBe('Session');
  expect(result.unscheduled[0].authors).toEqual(['Author Array']);
  expect(result.unscheduled[1].authors).toEqual(['Author String']);
});

test('falls back to manuscript title and roomId when available', () => {
  const scheduleRepositoryStub = {
    getSchedule: () => ({
      scheduleId: 'sched_stub',
      status: 'published',
      publishedAt: '2026-06-01T00:00:00.000Z',
      updatedAt: null,
    }),
    getScheduleItems: () => ([
      {
        entryId: 'entry_stub',
        paperId: 'paper_stub',
        roomId: 'Room Stub',
        startTime: '2026-06-01T09:00:00.000Z',
        endTime: '2026-06-01T09:30:00.000Z',
      },
      {
        entryId: 'entry_untitled',
        paperId: 'paper_untitled',
        startTime: '2026-06-01T10:00:00.000Z',
        endTime: '2026-06-01T10:30:00.000Z',
      },
    ]),
  };
  const submissionStorageStub = {
    getManuscripts: () => ([
      { id: 'paper_stub', title: 'Manuscript Title', authorNames: 'Author A', abstract: 'Abstract' },
    ]),
  };
  const result = publicScheduleService.getPublicSchedule({
    conferenceId: 'conf_stub',
    scheduleRepository: scheduleRepositoryStub,
    submissionStorage: submissionStorageStub,
  });
  expect(result.ok).toBe(true);
  expect(result.entries[0].paperTitle).toBe('Manuscript Title');
  expect(result.entries[0].room).toBe('Room Stub');
  expect(result.unscheduled[0].paperTitle).toBe('Untitled paper');
  expect(result.lastUpdatedAt).toBe('2026-06-01T00:00:00.000Z');
});

test('covers session labels and room fallbacks', () => {
  const scheduleRepositoryStub = {
    getSchedule: () => ({
      scheduleId: 'sched_mix',
      status: 'published',
      updatedAt: '2026-06-01T00:00:00.000Z',
    }),
    getScheduleItems: () => ([
      {
        entryId: 'e1',
        paperId: 'p1',
        roomName: 'Room A',
        startTime: '2026-06-01T09:00:00.000Z',
        endTime: '2026-06-01T09:30:00.000Z',
        session: 'Session One',
      },
      {
        entryId: 'e2',
        id: 'p2',
        roomId: 'Room B',
        startTime: '2026-06-01T10:00:00.000Z',
        endTime: '2026-06-01T10:30:00.000Z',
        sessionLabel: 'Session Label',
      },
      {
        entryId: 'e3',
        paperId: 'p3',
        roomId: 'Room C',
        startTime: '2026-06-01T11:00:00.000Z',
        endTime: '2026-06-01T11:30:00.000Z',
        track: 'Track Name',
        isUnscheduled: true,
      },
      {
        entryId: 'e4',
        paperId: 'p4',
        roomId: 'Room D',
        startTime: '2026-06-01T12:00:00.000Z',
        endTime: '2026-06-01T12:30:00.000Z',
        trackLabel: 'Track Label',
      },
      {
        paperId: 'p5',
        startTime: '2026-06-01T13:00:00.000Z',
        endTime: '2026-06-01T13:30:00.000Z',
      },
      {
        itemId: 'item_only',
        paperId: 'p_item',
        roomName: 'Room E',
        startTime: '2026-06-01T14:00:00.000Z',
        endTime: '2026-06-01T14:30:00.000Z',
        session: 'Session Item',
      },
      {
        roomName: 'Room F',
        startTime: '2026-06-01T15:00:00.000Z',
        endTime: '2026-06-01T15:30:00.000Z',
      },
      null,
    ]),
  };
  const submissionStorageStub = { getManuscripts: () => [] };
  const result = publicScheduleService.getPublicSchedule({
    conferenceId: 'conf_mix',
    scheduleRepository: scheduleRepositoryStub,
    submissionStorage: submissionStorageStub,
  });
  expect(result.ok).toBe(true);
  const sessions = result.entries.map((entry) => entry.session);
  expect(sessions).toContain('Session One');
  expect(sessions).toContain('Session Label');
  expect(sessions).toContain('Track Label');
  expect(result.entries.some((entry) => entry.paperId === 'p2')).toBe(true);
  const unscheduled = result.unscheduled.find((entry) => entry.paperId === 'p5');
  expect(unscheduled.room).toBe('TBD room');
  expect(result.unscheduled.some((entry) => entry.paperId === 'p3')).toBe(true);
  const itemEntry = result.entries.find((entry) => entry.paperId === 'p_item');
  expect(itemEntry.id).toBe('item_only');
  const paperIdEntry = result.unscheduled.find((entry) => entry.paperId === 'p5');
  expect(paperIdEntry.id).toBe('p5');
  const nullIdEntry = result.entries.find((entry) => entry.paperId === undefined);
  expect(nullIdEntry.id).toBeNull();
});

test('handles non-array schedule items and missing timestamps', () => {
  const scheduleRepositoryStub = {
    getSchedule: () => ({
      scheduleId: 'sched_empty',
      status: 'published',
      updatedAt: null,
      publishedAt: null,
    }),
    getScheduleItems: () => 'bad',
  };
  const submissionStorageStub = { getManuscripts: () => [] };
  const result = publicScheduleService.getPublicSchedule({
    conferenceId: 'conf_empty',
    scheduleRepository: scheduleRepositoryStub,
    submissionStorage: submissionStorageStub,
  });
  expect(result.ok).toBe(true);
  expect(result.entries).toEqual([]);
  expect(result.lastUpdatedAt).toBeNull();
});
