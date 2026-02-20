import { createScheduleHtmlView } from '../../src/views/schedule_html_view.js';
import { createScheduleHtmlController } from '../../src/controllers/schedule_html_controller.js';
import { auditLogService } from '../../src/services/audit_log_service.js';
import { sessionState } from '../../src/models/session-state.js';

beforeEach(() => {
  auditLogService.reset();
  sessionState.clear();
  document.body.innerHTML = '';
});

test('denies unauthorized access and logs the attempt', () => {
  const scheduleService = { getPublishedSchedule: () => null };
  sessionState.authenticate({ id: 'acct_user', role: 'Author' });
  const view = createScheduleHtmlView();
  document.body.appendChild(view.element);
  const controller = createScheduleHtmlController({ view, sessionState, scheduleService, auditLogService });
  controller.show('conf_auth');
  expect(view.element.textContent).toContain('Access denied');
  const logs = auditLogService.getLogs();
  expect(logs[0].eventType).toBe('schedule_view_denied');
});
