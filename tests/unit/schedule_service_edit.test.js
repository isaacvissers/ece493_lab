import { scheduleRepository } from '../../src/services/schedule_repository.js';
import { scheduleService } from '../../src/services/schedule_service.js';
import { auditLogService } from '../../src/services/audit_log_service.js';
import { notificationService } from '../../src/services/notification_service.js';
import { createConference } from '../../src/models/conference.js';

beforeEach(() => {
  scheduleRepository.reset();
  auditLogService.reset();
  notificationService.reset();
});

test('getDraftSchedule returns null for published schedules', () => {
  const draft = scheduleRepository.saveDraft({ conferenceId: 'conf_pub', items: [] });
  scheduleRepository.publishSchedule({ conferenceId: draft.conferenceId });
  expect(scheduleService.getDraftSchedule('conf_pub')).toBeNull();
});

test('getDraftSchedule returns draft schedule data', () => {
  const conference = createConference({ conferenceId: 'conf_draft' });
  scheduleRepository.saveConference(conference);
  const draft = scheduleRepository.saveDraft({
    conferenceId: conference.conferenceId,
    items: [{ entryId: 'entry_1', paperId: 'paper_1', roomId: 'room_a', startTime: '2026-05-01T09:00:00.000Z', endTime: '2026-05-01T09:30:00.000Z' }],
  });
  const result = scheduleService.getDraftSchedule(conference.conferenceId);
  expect(result.schedule.scheduleId).toBe(draft.scheduleId);
  expect(result.entries).toHaveLength(1);
  expect(result.conference.conferenceId).toBe(conference.conferenceId);
});

test('updateScheduleEntry returns not_found when schedule missing', () => {
  const result = scheduleService.updateScheduleEntry({
    conferenceId: 'conf_missing',
    entryId: 'entry_1',
    roomId: 'room_a',
    startTime: '2026-05-01T10:00:00.000Z',
    endTime: '2026-05-01T10:30:00.000Z',
    scheduleVersion: 1,
    auditLogService,
    notificationService,
  });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('not_found');
});

test('updateScheduleEntry uses defaults when called without args', () => {
  const result = scheduleService.updateScheduleEntry();
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('not_found');
});

test('updateScheduleEntry returns not_found when entry missing', () => {
  scheduleRepository.saveDraft({
    conferenceId: 'conf_entry_missing',
    items: [{ entryId: 'entry_1', paperId: 'paper_1', roomId: 'room_a', startTime: '2026-05-01T09:00:00.000Z', endTime: '2026-05-01T09:30:00.000Z', status: 'scheduled' }],
  });
  const result = scheduleService.updateScheduleEntry({
    conferenceId: 'conf_entry_missing',
    entryId: 'entry_2',
    roomId: 'room_b',
    startTime: '2026-05-01T10:00:00.000Z',
    endTime: '2026-05-01T10:30:00.000Z',
    scheduleVersion: 1,
    auditLogService,
    notificationService,
  });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('not_found');
});

test('updateScheduleEntry logs conflicts with itemId fallback', () => {
  scheduleRepository.saveDraft({
    conferenceId: 'conf_conflict',
    items: [{ entryId: 'entry_1', paperId: 'paper_1', roomId: 'room_a', startTime: '2026-05-01T09:00:00.000Z', endTime: '2026-05-01T09:30:00.000Z', status: 'scheduled' }],
  });
  const result = scheduleService.updateScheduleEntry({
    conferenceId: 'conf_conflict',
    entryId: 'entry_1',
    roomId: 'room_a',
    startTime: '2026-05-01T09:00:00.000Z',
    endTime: '2026-05-01T09:30:00.000Z',
    scheduleVersion: 1,
    scheduleValidationService: {
      validateEdit: () => ({ ok: false, reason: 'conflict', conflictEntry: { itemId: 'item_1' } }),
    },
    auditLogService,
    notificationService,
  });
  expect(result.ok).toBe(false);
  const logs = auditLogService.getLogs();
  expect(logs[0].details.conflictEntryId).toBe('item_1');
});

test('updateScheduleEntry detects version conflict', () => {
  const schedule = scheduleRepository.saveDraft({
    conferenceId: 'conf_version',
    items: [{ entryId: 'entry_1', paperId: 'paper_1', roomId: 'room_a', startTime: '2026-05-01T09:00:00.000Z', endTime: '2026-05-01T09:30:00.000Z', status: 'scheduled' }],
  });
  const result = scheduleService.updateScheduleEntry({
    conferenceId: 'conf_version',
    entryId: 'entry_1',
    roomId: 'room_b',
    startTime: '2026-05-01T10:00:00.000Z',
    endTime: '2026-05-01T10:30:00.000Z',
    scheduleVersion: schedule.version - 1,
    auditLogService,
    notificationService,
  });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('version_conflict');
});

test('updateScheduleEntry saves updates and increments version', () => {
  const schedule = scheduleRepository.saveDraft({
    conferenceId: 'conf_update',
    items: [
      { entryId: 'entry_1', paperId: 'paper_1', roomId: 'room_a', startTime: '2026-05-01T09:00:00.000Z', endTime: '2026-05-01T09:30:00.000Z', status: 'scheduled' },
      null,
    ],
  });
  const result = scheduleService.updateScheduleEntry({
    conferenceId: 'conf_update',
    entryId: 'entry_1',
    roomId: 'room_b',
    startTime: '2026-05-01T10:00:00.000Z',
    endTime: '2026-05-01T10:30:00.000Z',
    scheduleVersion: schedule.version,
    auditLogService,
    notificationService,
  });
  expect(result.ok).toBe(true);
  expect(result.schedule.version).toBe(schedule.version + 1);
});

test('updateScheduleEntry handles schedules without version', () => {
  const schedule = scheduleRepository.saveDraft({
    conferenceId: 'conf_zero',
    version: 0,
    items: [{ entryId: 'entry_1', paperId: 'paper_1', roomId: 'room_a', startTime: '2026-05-01T09:00:00.000Z', endTime: '2026-05-01T09:30:00.000Z', status: 'scheduled' }],
  });
  const result = scheduleService.updateScheduleEntry({
    conferenceId: 'conf_zero',
    entryId: 'entry_1',
    roomId: 'room_b',
    startTime: '2026-05-01T10:00:00.000Z',
    endTime: '2026-05-01T10:30:00.000Z',
    scheduleVersion: schedule.version,
    auditLogService,
    notificationService,
  });
  expect(result.ok).toBe(true);
  expect(result.schedule.version).toBe(1);
});

test('updateScheduleEntry skips null entries when updating', () => {
  const schedule = scheduleRepository.saveDraft({
    conferenceId: 'conf_null_entries',
    items: [{ entryId: 'entry_1', paperId: 'paper_1', roomId: 'room_a', startTime: '2026-05-01T09:00:00.000Z', endTime: '2026-05-01T09:30:00.000Z', status: 'scheduled' }],
  });
  const originalGetScheduleItems = scheduleRepository.getScheduleItems;
  scheduleRepository.getScheduleItems = () => [
    null,
    { entryId: 'entry_1', paperId: 'paper_1', roomId: 'room_a', startTime: '2026-05-01T09:00:00.000Z', endTime: '2026-05-01T09:30:00.000Z', status: 'scheduled' },
  ];
  const result = scheduleService.updateScheduleEntry({
    conferenceId: 'conf_null_entries',
    entryId: 'entry_1',
    roomId: 'room_b',
    startTime: '2026-05-01T10:00:00.000Z',
    endTime: '2026-05-01T10:30:00.000Z',
    scheduleVersion: schedule.version,
    auditLogService,
    notificationService,
  });
  scheduleRepository.getScheduleItems = originalGetScheduleItems;
  expect(result.ok).toBe(true);
});

test('updateScheduleEntry logs failure when save throws without message', () => {
  const schedule = scheduleRepository.saveDraft({
    conferenceId: 'conf_throw',
    items: [{ entryId: 'entry_1', paperId: 'paper_1', roomId: 'room_a', startTime: '2026-05-01T09:00:00.000Z', endTime: '2026-05-01T09:30:00.000Z', status: 'scheduled' }],
  });
  const originalSaveDraft = scheduleRepository.saveDraft;
  scheduleRepository.saveDraft = () => {
    throw {};
  };
  const result = scheduleService.updateScheduleEntry({
    conferenceId: 'conf_throw',
    entryId: 'entry_1',
    roomId: 'room_b',
    startTime: '2026-05-01T10:00:00.000Z',
    endTime: '2026-05-01T10:30:00.000Z',
    scheduleVersion: schedule.version,
    auditLogService,
    notificationService,
  });
  scheduleRepository.saveDraft = originalSaveDraft;
  expect(result.ok).toBe(false);
  const logs = auditLogService.getLogs();
  expect(logs[0].details.message).toBe('save_failed');
});

test('updateScheduleEntry logs notification failures without reason', () => {
  scheduleRepository.saveDraft({
    conferenceId: 'conf_notify',
    items: [{ entryId: 'entry_1', paperId: 'paper_1', roomId: 'room_a', startTime: '2026-05-01T09:00:00.000Z', endTime: '2026-05-01T09:30:00.000Z', status: 'scheduled' }],
  });
  const result = scheduleService.updateScheduleEntry({
    conferenceId: 'conf_notify',
    entryId: 'entry_1',
    roomId: 'room_b',
    startTime: '2026-05-01T10:00:00.000Z',
    endTime: '2026-05-01T10:30:00.000Z',
    scheduleVersion: 1,
    auditLogService,
    notificationService: {
      triggerScheduleNotifications: () => ({ ok: false }),
    },
  });
  expect(result.ok).toBe(true);
  const logs = auditLogService.getLogs();
  expect(logs[0].eventType).toBe('schedule_notification_failed');
  expect(logs[0].details.message).toBe('notification_failed');
});
