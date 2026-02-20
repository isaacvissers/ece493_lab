import { createScheduleHtmlView } from '../../src/views/schedule_html_view.js';
import { createScheduleHtmlController } from '../../src/controllers/schedule_html_controller.js';
import { auditLogService } from '../../src/services/audit_log_service.js';
import { sessionState } from '../../src/models/session-state.js';

beforeEach(() => {
  auditLogService.reset();
  sessionState.clear();
  document.body.innerHTML = '';
});

test('shows error and logs when rendering fails', () => {
  const scheduleService = {
    getPublishedSchedule: () => ({
      schedule: { scheduleId: 'sched_fail', status: 'published' },
      items: [],
    }),
  };
  const scheduleRenderer = {
    renderAgenda: () => {
      throw new Error('boom');
    },
  };
  sessionState.authenticate({ id: 'acct_admin', role: 'Admin' });
  const view = createScheduleHtmlView();
  document.body.appendChild(view.element);
  const controller = createScheduleHtmlController({
    view,
    sessionState,
    scheduleService,
    scheduleRenderer,
    auditLogService,
  });
  controller.show('conf_fail');
  expect(view.element.textContent).toContain('could not be rendered');
  const logs = auditLogService.getLogs();
  expect(logs[0].eventType).toBe('schedule_render_failed');
});
