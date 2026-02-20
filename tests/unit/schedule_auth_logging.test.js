import { createScheduleHtmlView } from '../../src/views/schedule_html_view.js';
import { createScheduleHtmlController } from '../../src/controllers/schedule_html_controller.js';
import { auditLogService } from '../../src/services/audit_log_service.js';
import { sessionState } from '../../src/models/session-state.js';

beforeEach(() => {
  auditLogService.reset();
  sessionState.clear();
  document.body.innerHTML = '';
});

test('logs access denial for unauthorized users', () => {
  const scheduleService = { getPublishedSchedule: () => null };
  sessionState.authenticate({ id: 'acct_user', role: 'Author' });
  const view = createScheduleHtmlView();
  document.body.appendChild(view.element);
  const controller = createScheduleHtmlController({
    view,
    sessionState,
    scheduleService,
    auditLogService,
  });
  controller.show('conf_auth');
  const logs = auditLogService.getLogs();
  expect(logs.length).toBe(1);
  expect(logs[0].eventType).toBe('schedule_view_denied');
});

test('logs denial with fallback userId when id missing', () => {
  const scheduleService = { getPublishedSchedule: () => null };
  const authService = {
    requireAuth: () => ({ ok: true, user: { userId: 'acct_fallback', role: 'Author' } }),
    isAdminOrEditor: () => false,
  };
  const view = createScheduleHtmlView();
  document.body.appendChild(view.element);
  const controller = createScheduleHtmlController({
    view,
    sessionState,
    scheduleService,
    authService,
    auditLogService,
  });
  controller.show('conf_auth');
  const logs = auditLogService.getLogs();
  expect(logs[0].details.userId).toBe('acct_fallback');
});
