import { createScheduleHtmlView } from '../../src/views/schedule_html_view.js';
import { createScheduleHtmlController } from '../../src/controllers/schedule_html_controller.js';
import { sessionState } from '../../src/models/session-state.js';

beforeEach(() => {
  sessionState.clear();
  document.body.innerHTML = '';
});

test('schedule view responds within 200 ms for typical data', () => {
  const items = [];
  for (let i = 0; i < 100; i += 1) {
    items.push({
      paperTitle: `Paper ${i}`,
      roomName: `Room ${i % 4}`,
      startTime: `2026-05-01T${String(9 + (i % 4)).padStart(2, '0')}:00:00.000Z`,
      endTime: `2026-05-01T${String(9 + (i % 4)).padStart(2, '0')}:30:00.000Z`,
      status: 'scheduled',
    });
  }
  const scheduleService = {
    getPublishedSchedule: () => ({
      schedule: { scheduleId: 'sched_perf', status: 'published' },
      items,
    }),
  };
  sessionState.authenticate({ id: 'acct_admin', role: 'Admin' });
  const view = createScheduleHtmlView();
  document.body.appendChild(view.element);
  const controller = createScheduleHtmlController({ view, sessionState, scheduleService, timeoutMs: 2000 });
  const start = Date.now();
  controller.show('conf_perf');
  const elapsed = Date.now() - start;
  expect(elapsed).toBeLessThan(200);
});
