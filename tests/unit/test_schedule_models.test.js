import { createConference } from '../../src/models/conference.js';
import { createRoom } from '../../src/models/room.js';
import { createTimeSlot } from '../../src/models/time_slot.js';
import { createSchedule } from '../../src/models/schedule.js';
import { createScheduleItem } from '../../src/models/schedule_item.js';

test('creates conference with defaults', () => {
  const conference = createConference({ conferenceId: 'conf_1', rooms: [] });
  expect(conference.conferenceId).toBe('conf_1');
  expect(Array.isArray(conference.rooms)).toBe(true);
  const invalidRooms = createConference({ conferenceId: 'conf_2', rooms: 'Room A' });
  expect(invalidRooms.rooms).toEqual([]);
  const generated = createConference();
  expect(generated.conferenceId).toMatch(/^conf_/);
});

test('creates room with capacity parsing', () => {
  const room = createRoom({ name: 'Room A', capacity: '120' });
  expect(room.capacity).toBe(120);
  const nullCapacity = createRoom({ name: 'Room Null', capacity: null });
  expect(nullCapacity.capacity).toBeNull();
  const unset = createRoom({ name: 'Room B' });
  expect(unset.capacity).toBeNull();
  const invalid = createRoom({ name: 'Room C', capacity: 'not-a-number' });
  expect(invalid.capacity).toBeNull();
  const defaults = createRoom();
  expect(defaults.roomId).toMatch(/^room_/);
  expect(defaults.name).toBe('');
});

test('creates time slot with generated id', () => {
  const slot = createTimeSlot({ startTime: '2026-05-01T09:00:00.000Z', endTime: '2026-05-01T09:30:00.000Z', roomId: 'room_a' });
  expect(slot.slotId).toMatch(/^slot_/);
  const explicit = createTimeSlot({
    slotId: 'slot_explicit',
    startTime: '2026-05-01T10:00:00.000Z',
    endTime: '2026-05-01T10:30:00.000Z',
    roomId: 'room_b',
  });
  expect(explicit.slotId).toBe('slot_explicit');
  const defaults = createTimeSlot();
  expect(defaults.slotId).toMatch(/^slot_/);
});

test('creates schedule with timestamps', () => {
  const schedule = createSchedule({ conferenceId: 'conf_1' });
  expect(schedule.scheduleId).toMatch(/^sched_/);
  expect(schedule.createdAt).toBe(schedule.updatedAt);
  const explicit = createSchedule({
    scheduleId: 'sched_1',
    conferenceId: 'conf_1',
    createdAt: '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-02T00:00:00.000Z',
  });
  expect(explicit.updatedAt).toBe('2026-05-02T00:00:00.000Z');
  const defaults = createSchedule();
  expect(defaults.scheduleId).toMatch(/^sched_/);
});

test('creates schedule item with defaults', () => {
  const item = createScheduleItem({ scheduleId: 'sched_1', paperId: 'paper_1' });
  expect(item.itemId).toMatch(/^item_/);
  expect(item.status).toBe('scheduled');
  const explicit = createScheduleItem({
    itemId: 'item_1',
    scheduleId: 'sched_2',
    paperId: 'paper_2',
    roomId: 'room_a',
    slotId: 'slot_1',
    status: 'unscheduled',
    reason: 'capacity_shortfall',
  });
  expect(explicit.itemId).toBe('item_1');
  expect(explicit.status).toBe('unscheduled');
  expect(explicit.reason).toBe('capacity_shortfall');
  const defaults = createScheduleItem();
  expect(defaults.itemId).toMatch(/^item_/);
});
