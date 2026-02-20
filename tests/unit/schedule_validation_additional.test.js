import { scheduleValidationService } from '../../src/services/schedule_validation_service.js';

test('returns not_found when entry is missing', () => {
  const result = scheduleValidationService.validateEdit({ entry: null });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('not_found');
});

test('returns not_found when called with no arguments', () => {
  const result = scheduleValidationService.validateEdit();
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('not_found');
});

test('blocks invalid time ranges', () => {
  const entry = {
    entryId: 'entry_1',
    paperId: 'paper_1',
    roomId: 'room_a',
    startTime: '2026-05-01T09:00:00.000Z',
    endTime: '2026-05-01T09:30:00.000Z',
  };
  const result = scheduleValidationService.validateEdit({
    entry,
    updates: { startTime: 'invalid', endTime: 'invalid' },
    entries: [entry],
  });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('invalid_time');
});

test('blocks duplicate paper assignments', () => {
  const entry = {
    entryId: 'entry_1',
    paperId: 'paper_1',
    roomId: 'room_a',
    startTime: '2026-05-01T09:00:00.000Z',
    endTime: '2026-05-01T09:30:00.000Z',
  };
  const entries = [
    entry,
    {
      entryId: 'entry_2',
      paperId: 'paper_1',
      roomId: 'room_b',
      startTime: '2026-05-01T10:00:00.000Z',
      endTime: '2026-05-01T10:30:00.000Z',
    },
  ];
  const result = scheduleValidationService.validateEdit({
    entry,
    updates: { roomId: 'room_a', startTime: '2026-05-01T11:00:00.000Z', endTime: '2026-05-01T11:30:00.000Z' },
    entries,
  });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('duplicate_paper');
});

test('handles entries identified by itemId', () => {
  const entry = {
    itemId: 'item_1',
    paperId: 'paper_1',
    roomId: 'room_a',
    startTime: '2026-05-01T09:00:00.000Z',
    endTime: '2026-05-01T09:30:00.000Z',
  };
  const result = scheduleValidationService.validateEdit({
    entry,
    updates: { roomId: 'room_b', startTime: '2026-05-01T10:00:00.000Z', endTime: '2026-05-01T10:30:00.000Z' },
    entries: [entry],
  });
  expect(result.ok).toBe(true);
});

test('uses dateRange window when explicit time window missing', () => {
  const entry = {
    entryId: 'entry_1',
    paperId: 'paper_1',
    roomId: 'room_a',
    startTime: '2026-05-01T09:00:00.000Z',
    endTime: '2026-05-01T09:30:00.000Z',
  };
  const result = scheduleValidationService.validateEdit({
    entry,
    updates: { startTime: '2026-05-01T07:00', endTime: '2026-05-01T07:30' },
    entries: [entry],
    conference: { dateRange: { start: '2026-05-01T08:00:00.000Z', end: '2026-05-01T12:00:00.000Z' } },
  });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('outside_window');
});

test('ignores null entries and invalid times during conflict checks', () => {
  const entry = {
    entryId: 'entry_1',
    paperId: 'paper_1',
    roomId: 'room_a',
    startTime: '2026-05-01T09:00:00.000Z',
    endTime: '2026-05-01T09:30:00.000Z',
  };
  const result = scheduleValidationService.validateEdit({
    entry,
    updates: { startTime: '2026-05-01T10:00:00.000Z', endTime: '2026-05-01T10:30:00.000Z' },
    entries: [
      null,
      { entryId: 'entry_2', paperId: 'paper_2', roomId: 'room_a', startTime: null, endTime: null },
    ],
  });
  expect(result.ok).toBe(true);
});

test('handles missing conference window values', () => {
  const entry = {
    entryId: 'entry_1',
    paperId: 'paper_1',
    roomId: 'room_a',
    startTime: '2026-05-01T09:00:00.000Z',
    endTime: '2026-05-01T09:30:00.000Z',
  };
  const result = scheduleValidationService.validateEdit({
    entry,
    updates: { startTime: '2026-05-01T10:00:00.000Z', endTime: '2026-05-01T10:30:00.000Z' },
    entries: [entry],
    conference: { dateRange: { start: null, end: null } },
  });
  expect(result.ok).toBe(true);
});
