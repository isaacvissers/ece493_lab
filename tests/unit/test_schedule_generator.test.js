import { scheduleGenerator, __test__ } from '../../src/services/schedule_generator.js';

test('rejects invalid conference input', () => {
  const result = scheduleGenerator.generate();
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('invalid_conference');
});

test('rejects invalid inputs when slots cannot be built', () => {
  const result = scheduleGenerator.generate({ conference: { dateRange: null, rooms: [], slotDurationMinutes: 0 } });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('invalid_inputs');
});

test('flags conflicts when room ids overlap', () => {
  const conference = {
    dateRange: { start: '2026-05-01T09:00:00.000Z', end: '2026-05-01T10:00:00.000Z' },
    rooms: [{ roomId: 'room_a' }, { roomId: 'room_a' }],
    slotDurationMinutes: 30,
  };
  const result = scheduleGenerator.generate({ conference, papers: [] });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('conflict');
});

test('creates unscheduled items for capacity shortfall and missing metadata', () => {
  const conference = {
    dateRange: { start: '2026-05-01T09:00:00.000Z', end: '2026-05-01T10:00:00.000Z' },
    rooms: [{ roomId: 'room_a' }],
    slotDurationMinutes: 60,
  };
  const papers = [
    { paperId: 'p1', status: 'accepted', requiredMetadataComplete: true },
    { paperId: 'p2', status: 'accepted', requiredMetadataComplete: false },
    { paperId: 'p3', status: 'accepted', requiredMetadataComplete: true },
  ];
  const result = scheduleGenerator.generate({ conference, papers });
  expect(result.ok).toBe(true);
  expect(result.items.length).toBe(1);
  const reasons = result.unscheduled.map((item) => item.reason);
  expect(reasons).toContain('missing_metadata');
  expect(reasons).toContain('capacity_shortfall');
});

test('reports timeout when generation exceeds max duration', () => {
  const conference = {
    dateRange: { start: '2026-05-01T09:00:00.000Z', end: '2026-05-01T10:00:00.000Z' },
    rooms: [{ roomId: 'room_a' }],
    slotDurationMinutes: 30,
  };
  let tick = 0;
  const clock = () => {
    tick += 70000;
    return tick;
  };
  const result = scheduleGenerator.generate({
    conference,
    papers: [{ paperId: 'p1', status: 'accepted', requiredMetadataComplete: true }],
    clock,
    maxDurationMs: 1000,
  });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('generation_timeout');
});

test('helper functions handle empty inputs', () => {
  expect(__test__.buildTimeSlots()).toEqual([]);
  expect(__test__.hasSlotConflicts()).toBe(false);
});

test('rejects when date range is invalid or reversed', () => {
  const invalidDate = scheduleGenerator.generate({
    conference: {
      dateRange: { start: 'invalid', end: '2026-05-01T10:00:00.000Z' },
      rooms: [{ roomId: 'room_a' }],
      slotDurationMinutes: 30,
    },
    papers: [],
  });
  expect(invalidDate.ok).toBe(false);
  expect(invalidDate.reason).toBe('invalid_inputs');

  const reversed = scheduleGenerator.generate({
    conference: {
      dateRange: { start: '2026-05-01T10:00:00.000Z', end: '2026-05-01T09:00:00.000Z' },
      rooms: [{ roomId: 'room_a' }],
      slotDurationMinutes: 30,
    },
    papers: [],
  });
  expect(reversed.ok).toBe(false);
  expect(reversed.reason).toBe('invalid_inputs');
});

test('rejects when slot duration is not finite', () => {
  const result = scheduleGenerator.generate({
    conference: {
      dateRange: { start: '2026-05-01T09:00:00.000Z', end: '2026-05-01T10:00:00.000Z' },
      rooms: [{ roomId: 'room_a' }],
      slotDurationMinutes: 'nope',
    },
    papers: [],
  });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('invalid_inputs');
});

test('uses room id and name fallbacks when roomId is missing', () => {
  const conference = {
    dateRange: { start: '2026-05-01T09:00:00.000Z', end: '2026-05-01T10:00:00.000Z' },
    rooms: [{ id: 'room_id' }, { name: 'Room Name' }],
    slotDurationMinutes: 60,
  };
  const papers = [
    { paperId: 'p1', status: 'accepted', requiredMetadataComplete: true },
    { paperId: 'p2', status: 'accepted', requiredMetadataComplete: true },
  ];
  const result = scheduleGenerator.generate({ conference, papers });
  expect(result.ok).toBe(true);
  expect(result.items[0].roomId).toBe('room_id');
  expect(result.items[1].roomId).toBe('Room Name');
});

test('handles non-array papers input and id fallbacks', () => {
  const conference = {
    dateRange: { start: '2026-05-01T09:00:00.000Z', end: '2026-05-01T10:00:00.000Z' },
    rooms: [{ roomId: 'room_a' }],
    slotDurationMinutes: 60,
  };
  const nonArray = scheduleGenerator.generate({ conference, papers: 'nope' });
  expect(nonArray.ok).toBe(true);
  expect(nonArray.totalAccepted).toBe(0);

  const result = scheduleGenerator.generate({
    conference,
    papers: [
      { id: 'p1', status: 'accepted', requiredMetadataComplete: true },
      { id: 'p2', status: 'accepted', requiredMetadataComplete: false },
      { id: 'p3', status: 'accepted', requiredMetadataComplete: true },
    ],
  });
  const ids = result.items.map((item) => item.paperId);
  expect(ids).toContain('p1');
  const unscheduledIds = result.unscheduled.map((item) => item.paperId);
  expect(unscheduledIds).toContain('p2');
});
