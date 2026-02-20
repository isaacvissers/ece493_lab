import { scheduleValidationService } from '../../src/services/schedule_validation_service.js';

const baseEntry = {
  entryId: 'entry_1',
  paperId: 'paper_1',
  roomId: 'room_a',
  startTime: '2026-05-01T09:00:00.000Z',
  endTime: '2026-05-01T09:30:00.000Z',
};

test('blocks updates that conflict with another entry in same room', () => {
  const entries = [
    baseEntry,
    {
      entryId: 'entry_2',
      paperId: 'paper_2',
      roomId: 'room_a',
      startTime: '2026-05-01T09:15:00.000Z',
      endTime: '2026-05-01T09:45:00.000Z',
    },
  ];

  const result = scheduleValidationService.validateEdit({
    entry: baseEntry,
    updates: { startTime: '2026-05-01T09:10:00.000Z', endTime: '2026-05-01T09:40:00.000Z' },
    entries,
  });

  expect(result.ok).toBe(false);
  expect(result.reason).toBe('conflict');
  expect(result.conflictEntry.entryId).toBe('entry_2');
});

test('allows updates when no conflicts exist', () => {
  const entries = [
    baseEntry,
    {
      entryId: 'entry_2',
      paperId: 'paper_2',
      roomId: 'room_b',
      startTime: '2026-05-01T09:15:00.000Z',
      endTime: '2026-05-01T09:45:00.000Z',
    },
  ];

  const result = scheduleValidationService.validateEdit({
    entry: baseEntry,
    updates: { roomId: 'room_b', startTime: '2026-05-01T10:00:00.000Z', endTime: '2026-05-01T10:30:00.000Z' },
    entries,
  });

  expect(result.ok).toBe(true);
  expect(result.entry.roomId).toBe('room_b');
});
