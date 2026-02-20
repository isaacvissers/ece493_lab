import { scheduleRenderer } from '../../src/services/schedule_renderer.js';

test('groups schedule items by room and sorts by time', () => {
  const items = [
    { paperTitle: 'Paper B', roomName: 'Room B', startTime: '2026-05-01T10:00:00.000Z', endTime: '2026-05-01T10:30:00.000Z', status: 'scheduled' },
    { paperTitle: 'Paper A', roomName: 'Room A', startTime: '2026-05-01T09:00:00.000Z', endTime: '2026-05-01T09:30:00.000Z', status: 'scheduled' },
    { paperTitle: 'Paper C', roomName: 'Room B', startTime: '2026-05-01T09:00:00.000Z', endTime: '2026-05-01T09:30:00.000Z', status: 'scheduled' },
  ];
  const result = scheduleRenderer.renderAgenda({ items });
  expect(result.rooms.map((room) => room.roomName)).toEqual(['Room A', 'Room B']);
  expect(result.rooms[1].items.map((item) => item.paperTitle)).toEqual(['Paper C', 'Paper B']);
});

test('handles empty or invalid items input', () => {
  const result = scheduleRenderer.renderAgenda();
  expect(result.rooms).toEqual([]);
  expect(result.unscheduled).toEqual([]);
});

test('sorts items with invalid times last', () => {
  const items = [
    { paperTitle: 'Paper Bad', roomName: 'Room A', startTime: 'invalid', endTime: 'invalid', status: 'scheduled' },
    { paperTitle: 'Paper Good', roomName: 'Room A', startTime: '2026-05-01T09:00:00.000Z', endTime: '2026-05-01T09:30:00.000Z', status: 'scheduled' },
  ];
  const result = scheduleRenderer.renderAgenda({ items });
  expect(result.rooms[0].items[0].paperTitle).toBe('Paper Good');
});

test('handles items when both times are invalid', () => {
  const items = [
    { paperTitle: 'Paper Bad A', roomName: 'Room A', startTime: 'invalid', endTime: 'invalid', status: 'scheduled' },
    { paperTitle: 'Paper Bad B', roomName: 'Room A', startTime: 'invalid', endTime: 'invalid', status: 'scheduled' },
  ];
  const result = scheduleRenderer.renderAgenda({ items });
  expect(result.rooms[0].items.map((item) => item.paperTitle)).toEqual(['Paper Bad A', 'Paper Bad B']);
});

test('sorts items when later entry has invalid time', () => {
  const items = [
    { paperTitle: 'Paper First', roomName: 'Room A', startTime: '2026-05-01T09:00:00.000Z', endTime: '2026-05-01T09:30:00.000Z', status: 'scheduled' },
    { paperTitle: 'Paper Bad', roomName: 'Room A', startTime: 'invalid', endTime: 'invalid', status: 'scheduled' },
  ];
  const result = scheduleRenderer.renderAgenda({ items });
  expect(result.rooms[0].items[0].paperTitle).toBe('Paper First');
});
