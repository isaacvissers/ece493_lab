import { scheduleValidationService } from '../../src/services/schedule_validation_service.js';

const conference = {
  conferenceId: 'conf_1',
  timeWindowStart: '2026-05-01T08:00:00.000Z',
  timeWindowEnd: '2026-05-01T12:00:00.000Z',
};

test('blocks updates outside the conference time window', () => {
  const entry = {
    entryId: 'entry_1',
    paperId: 'paper_1',
    roomId: 'room_a',
    startTime: '2026-05-01T09:00:00.000Z',
    endTime: '2026-05-01T09:30:00.000Z',
  };
  const result = scheduleValidationService.validateEdit({
    entry,
    updates: { startTime: '2026-05-01T07:30:00.000Z', endTime: '2026-05-01T08:30:00.000Z' },
    entries: [entry],
    conference,
  });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('outside_window');
});

test('allows updates within the time window boundaries', () => {
  const entry = {
    entryId: 'entry_2',
    paperId: 'paper_2',
    roomId: 'room_a',
    startTime: '2026-05-01T08:00:00.000Z',
    endTime: '2026-05-01T09:00:00.000Z',
  };
  const result = scheduleValidationService.validateEdit({
    entry,
    updates: { startTime: '2026-05-01T12:00:00.000Z', endTime: '2026-05-01T12:30:00.000Z' },
    entries: [entry],
    conference: {
      ...conference,
      timeWindowEnd: '2026-05-01T12:30:00.000Z',
    },
  });
  expect(result.ok).toBe(true);
});
