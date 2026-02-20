import { scheduleValidation } from '../../src/services/schedule_validation.js';

test('validates required scheduling inputs', () => {
  const result = scheduleValidation.validateInputs({
    conferenceId: 'conf_1',
    startDate: '2026-05-01T09:00',
    endDate: '2026-05-01T12:00',
    slotDurationMinutes: 30,
    rooms: 'Room A | 100\nRoom B | 80',
  });
  expect(result.ok).toBe(true);
  expect(result.values.rooms.length).toBe(2);
});

test('flags missing conference id', () => {
  const result = scheduleValidation.validateInputs({
    conferenceId: '',
    startDate: '2026-05-01T09:00',
    endDate: '2026-05-01T12:00',
    slotDurationMinutes: 30,
    rooms: 'Room A',
  });
  expect(result.ok).toBe(false);
  expect(result.errors.conferenceId).toBe('required');
});

test('handles empty input values with defaults', () => {
  const result = scheduleValidation.validateInputs();
  expect(result.ok).toBe(false);
  expect(result.errors.conferenceId).toBe('required');
  expect(result.errors.startDate).toBe('invalid');
  expect(result.errors.endDate).toBe('invalid');
  expect(result.errors.slotDurationMinutes).toBe('invalid');
  expect(result.errors.rooms).toBe('required');
});

test('flags invalid date ranges', () => {
  const result = scheduleValidation.validateInputs({
    conferenceId: 'conf_1',
    startDate: 'invalid',
    endDate: '2026-05-01T08:00',
    slotDurationMinutes: 30,
    rooms: 'Room A',
  });
  expect(result.ok).toBe(false);
  expect(result.errors.startDate).toBe('invalid');
});

test('flags end date before start date', () => {
  const result = scheduleValidation.validateInputs({
    conferenceId: 'conf_1',
    startDate: '2026-05-01T12:00',
    endDate: '2026-05-01T10:00',
    slotDurationMinutes: 30,
    rooms: 'Room A',
  });
  expect(result.ok).toBe(false);
  expect(result.errors.endDate).toBe('range');
});

test('flags invalid duration and rooms', () => {
  const result = scheduleValidation.validateInputs({
    conferenceId: 'conf_1',
    startDate: '2026-05-01T09:00',
    endDate: '2026-05-01T10:00',
    slotDurationMinutes: 0,
    rooms: '',
  });
  expect(result.ok).toBe(false);
  expect(result.errors.slotDurationMinutes).toBe('invalid');
  expect(result.errors.rooms).toBe('required');
});

test('flags rooms with missing names', () => {
  const result = scheduleValidation.validateInputs({
    conferenceId: 'conf_1',
    startDate: '2026-05-01T09:00',
    endDate: '2026-05-01T10:00',
    slotDurationMinutes: 30,
    rooms: ' | 100\n|',
  });
  expect(result.ok).toBe(false);
  expect(result.errors.rooms).toBe('invalid');
});

test('accepts pre-parsed rooms array', () => {
  const result = scheduleValidation.validateInputs({
    conferenceId: 'conf_2',
    startDate: '2026-05-02T09:00',
    endDate: '2026-05-02T10:00',
    slotDurationMinutes: 30,
    rooms: [{ name: 'Room A', capacity: 50 }],
  });
  expect(result.ok).toBe(true);
  expect(result.values.rooms[0].name).toBe('Room A');
});

test('parses room capacity when invalid number provided', () => {
  const result = scheduleValidation.validateInputs({
    conferenceId: 'conf_3',
    startDate: '2026-05-03T09:00',
    endDate: '2026-05-03T10:00',
    slotDurationMinutes: 30,
    rooms: 'Room A | nope',
  });
  expect(result.ok).toBe(true);
  expect(result.values.rooms[0].capacity).toBeNull();
});
