import { createScheduleEntry } from '../../src/models/schedule_entry.js';

test('creates schedule entry with defaults', () => {
  const entry = createScheduleEntry({ scheduleId: 'sched_1', paperId: 'paper_1', roomId: 'room_a', startTime: '2026-05-01T09:00:00.000Z', endTime: '2026-05-01T09:30:00.000Z' });
  expect(entry.entryId).toContain('entry_');
  expect(entry.scheduleId).toBe('sched_1');
});

test('respects provided entryId', () => {
  const entry = createScheduleEntry({ entryId: 'entry_custom', scheduleId: 'sched_2', paperId: 'paper_2', roomId: 'room_b', startTime: '2026-05-01T10:00:00.000Z', endTime: '2026-05-01T10:30:00.000Z' });
  expect(entry.entryId).toBe('entry_custom');
});

test('generates entryId when empty string provided', () => {
  const entry = createScheduleEntry({ entryId: '', scheduleId: 'sched_3', paperId: 'paper_3', roomId: 'room_c', startTime: '2026-05-01T11:00:00.000Z', endTime: '2026-05-01T11:30:00.000Z' });
  expect(entry.entryId).toContain('entry_');
});

test('creates entry with defaults when no args provided', () => {
  const entry = createScheduleEntry();
  expect(entry.entryId).toContain('entry_');
});
