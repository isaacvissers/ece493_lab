import { scheduleRenderer } from '../../src/services/schedule_renderer.js';

test('renders 300 items within 2 seconds', () => {
  const items = [];
  for (let i = 0; i < 300; i += 1) {
    items.push({
      paperTitle: `Paper ${i}`,
      roomName: `Room ${i % 3}`,
      startTime: `2026-05-01T${String(9 + (i % 3)).padStart(2, '0')}:00:00.000Z`,
      endTime: `2026-05-01T${String(9 + (i % 3)).padStart(2, '0')}:30:00.000Z`,
      status: 'scheduled',
    });
  }
  const start = Date.now();
  const result = scheduleRenderer.renderAgenda({ items });
  const elapsed = Date.now() - start;
  expect(result.rooms.length).toBeGreaterThan(0);
  expect(elapsed).toBeLessThan(2000);
});
