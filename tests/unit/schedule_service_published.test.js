import { scheduleRepository } from '../../src/services/schedule_repository.js';
import { scheduleService } from '../../src/services/schedule_service.js';
import { auditLogService } from '../../src/services/audit_log_service.js';

beforeEach(() => {
  scheduleRepository.reset();
  auditLogService.reset();
});

test('returns access denied for authors without accepted papers', () => {
  scheduleRepository.savePapers([
    { paperId: 'paper_x', status: 'accepted', authorIds: ['author_x'], conferenceId: 'conf_x' },
  ]);
  scheduleRepository.saveDraft({ conferenceId: 'conf_x', items: [] });
  scheduleRepository.publishSchedule({ conferenceId: 'conf_x' });

  const result = scheduleService.getPublishedScheduleForAuthor({
    conferenceId: 'conf_x',
    authorId: 'author_y',
  });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('access_denied');
  expect(auditLogService.getLogs()[0].eventType).toBe('schedule_access_denied');
});

test('returns not_published when schedule missing or draft', () => {
  scheduleRepository.savePapers([
    { paperId: 'paper_pending', status: 'accepted', authorIds: ['author_p'], conferenceId: 'conf_pending' },
  ]);
  scheduleRepository.saveDraft({ conferenceId: 'conf_pending', items: [] });
  const result = scheduleService.getPublishedScheduleForAuthor({
    conferenceId: 'conf_pending',
    authorId: 'author_p',
  });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('not_published');
});

test('returns scheduled and unscheduled entries for an author', () => {
  scheduleRepository.savePapers([
    { paperId: 'paper_scheduled', title: 'Scheduled Paper', status: 'accepted', authorIds: ['author_a'], conferenceId: 'conf_sched' },
    { paperId: 'paper_unscheduled', title: 'Unscheduled Paper', status: 'accepted', authorIds: ['author_a'], conferenceId: 'conf_sched' },
  ]);
  scheduleRepository.saveDraft({
    conferenceId: 'conf_sched',
    items: [
      {
        entryId: 'entry_sched',
        paperId: 'paper_scheduled',
        roomId: 'Room C',
        startTime: '2026-06-12T09:00:00.000Z',
        endTime: '2026-06-12T09:30:00.000Z',
        status: 'scheduled',
      },
      {
        entryId: 'entry_unsched',
        paperId: 'paper_unscheduled',
        status: 'unscheduled',
      },
    ],
  });
  scheduleRepository.publishSchedule({ conferenceId: 'conf_sched' });

  const result = scheduleService.getPublishedScheduleForAuthor({
    conferenceId: 'conf_sched',
    authorId: 'author_a',
  });

  expect(result.ok).toBe(true);
  expect(result.scheduled).toHaveLength(1);
  expect(result.scheduled[0].roomName).toBe('Room C');
  expect(result.unscheduled).toHaveLength(1);
  expect(result.unscheduled[0].paperTitle).toBe('Unscheduled Paper');
});

test('uses default access denied reason when missing', () => {
  const result = scheduleService.getPublishedScheduleForAuthor({
    conferenceId: 'conf_reason',
    authorId: 'author_reason',
    authorAccessService: { getAcceptedPapersForAuthor: () => ({ ok: false }) },
  });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('access_denied');
});

test('uses paper.id fallback and handles missing entry', () => {
  scheduleRepository.savePapers([
    { id: 'paper_id_only', status: 'accepted', authorIds: ['author_id'], conferenceId: 'conf_id' },
  ]);
  scheduleRepository.saveDraft({
    conferenceId: 'conf_id',
    items: [],
  });
  scheduleRepository.publishSchedule({ conferenceId: 'conf_id' });

  const result = scheduleService.getPublishedScheduleForAuthor({
    conferenceId: 'conf_id',
    authorId: 'author_id',
  });

  expect(result.ok).toBe(true);
  expect(result.unscheduled[0].paperId).toBe('paper_id_only');
});

test('uses entry paperTitle when paper title missing', () => {
  scheduleRepository.savePapers([
    { paperId: 'paper_title_missing', status: 'accepted', authorIds: ['author_title'], conferenceId: 'conf_title' },
  ]);
  scheduleRepository.saveDraft({
    conferenceId: 'conf_title',
    items: [
      { entryId: 'entry_title', paperId: 'paper_title_missing', status: 'unscheduled', paperTitle: 'Entry Title' },
    ],
  });
  scheduleRepository.publishSchedule({ conferenceId: 'conf_title' });

  const result = scheduleService.getPublishedScheduleForAuthor({
    conferenceId: 'conf_title',
    authorId: 'author_title',
  });

  expect(result.ok).toBe(true);
  expect(result.unscheduled[0].paperTitle).toBe('Entry Title');
});

test('exposes unscheduled reasons when present', () => {
  scheduleRepository.savePapers([
    { paperId: 'paper_reason', status: 'accepted', authorIds: ['author_reason'], conferenceId: 'conf_reason2' },
  ]);
  scheduleRepository.saveDraft({
    conferenceId: 'conf_reason2',
    items: [
      { entryId: 'entry_reason', paperId: 'paper_reason', status: 'unscheduled', reason: 'capacity_shortfall' },
    ],
  });
  scheduleRepository.publishSchedule({ conferenceId: 'conf_reason2' });

  const result = scheduleService.getPublishedScheduleForAuthor({
    conferenceId: 'conf_reason2',
    authorId: 'author_reason',
  });

  expect(result.ok).toBe(true);
  expect(result.unscheduled[0].reason).toBe('capacity_shortfall');
});
