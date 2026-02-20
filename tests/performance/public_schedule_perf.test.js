import { createPublicScheduleView } from '../../src/views/public_schedule_view.js';
import { createPublicScheduleController } from '../../src/controllers/public_schedule_controller.js';
import { scheduleRepository } from '../../src/services/schedule_repository.js';

beforeEach(() => {
  scheduleRepository.reset();
  document.body.innerHTML = '';
});

test('public schedule page loads within 3 seconds for typical data', () => {
  const items = [];
  for (let i = 0; i < 200; i += 1) {
    items.push({
      entryId: `entry_${i}`,
      paperId: `paper_${i}`,
      roomName: `Room ${i % 5}`,
      startTime: `2026-06-01T${String(9 + (i % 5)).padStart(2, '0')}:00:00.000Z`,
      endTime: `2026-06-01T${String(9 + (i % 5)).padStart(2, '0')}:30:00.000Z`,
      session: `Session ${i % 3}`,
    });
  }
  scheduleRepository.saveDraft({ conferenceId: 'conf_perf', items });
  scheduleRepository.publishSchedule({ conferenceId: 'conf_perf' });
  const view = createPublicScheduleView();
  document.body.appendChild(view.element);
  const controller = createPublicScheduleController({ view, timeoutMs: 3000 });
  const start = Date.now();
  controller.show('conf_perf');
  const elapsed = Date.now() - start;
  expect(elapsed).toBeLessThan(3000);
});
