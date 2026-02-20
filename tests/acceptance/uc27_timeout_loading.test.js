import { createScheduleHtmlView } from '../../src/views/schedule_html_view.js';
import { createScheduleHtmlController } from '../../src/controllers/schedule_html_controller.js';
import { auditLogService } from '../../src/services/audit_log_service.js';
import { sessionState } from '../../src/models/session-state.js';

beforeEach(() => {
  auditLogService.reset();
  sessionState.clear();
  document.body.innerHTML = '';
});

test('shows timeout error for slow rendering', () => {
  const scheduleService = {
    getPublishedSchedule: () => ({
      schedule: { scheduleId: 'sched_timeout', status: 'published' },
      items: [
        { paperTitle: 'Paper A', roomName: 'Room A', startTime: '2026-05-01T09:00:00.000Z', endTime: '2026-05-01T09:30:00.000Z', status: 'scheduled' },
      ],
    }),
  };
  let tick = 0;
  const performanceService = {
    now: () => {
      tick += 3000;
      return tick;
    },
  };
  sessionState.authenticate({ id: 'acct_admin', role: 'Admin' });
  const view = createScheduleHtmlView();
  document.body.appendChild(view.element);
  const controller = createScheduleHtmlController({
    view,
    sessionState,
    scheduleService,
    performanceService,
    auditLogService,
    timeoutMs: 2000,
  });
  controller.show('conf_timeout');
  expect(view.element.textContent).toContain('timed out');
  const logs = auditLogService.getLogs();
  expect(logs[0].eventType).toBe('schedule_timeout');
});
