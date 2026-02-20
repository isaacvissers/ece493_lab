import { scheduleRenderer } from '../../src/services/schedule_renderer.js';

test('places unscheduled or incomplete items in unscheduled section', () => {
  const items = [
    { paperTitle: 'Paper A', roomName: 'Room A', startTime: '2026-05-01T09:00:00.000Z', endTime: '2026-05-01T09:30:00.000Z', status: 'scheduled' },
    { paperTitle: 'Paper B', status: 'unscheduled' },
    { paperTitle: 'Paper C', roomName: '', startTime: null, endTime: null, status: 'scheduled' },
    null,
  ];
  const result = scheduleRenderer.renderAgenda({ items });
  expect(result.rooms.length).toBe(1);
  expect(result.unscheduled.map((item) => item.paperTitle)).toEqual(['Paper B', 'Paper C']);
});
