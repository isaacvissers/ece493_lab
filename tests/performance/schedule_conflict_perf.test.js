import { scheduleValidationService } from '../../src/services/schedule_validation_service.js';

function buildEntries(count) {
  const entries = [];
  for (let i = 0; i < count; i += 1) {
    entries.push({
      entryId: `entry_${i}`,
      paperId: `paper_${i}`,
      roomId: `room_${i % 10}`,
      startTime: `2026-05-01T${String(9 + (i % 6)).padStart(2, '0')}:00:00.000Z`,
      endTime: `2026-05-01T${String(9 + (i % 6)).padStart(2, '0')}:30:00.000Z`,
    });
  }
  return entries;
}

test('conflict detection completes within 1 second for 300 entries', () => {
  const entries = buildEntries(300);
  const entry = entries[0];
  const start = Date.now();
  const result = scheduleValidationService.validateEdit({
    entry,
    updates: { roomId: 'room_11', startTime: '2026-05-01T15:00:00.000Z', endTime: '2026-05-01T15:30:00.000Z' },
    entries,
  });
  const elapsed = Date.now() - start;
  expect(result.ok).toBe(true);
  expect(elapsed).toBeLessThan(1000);
});
