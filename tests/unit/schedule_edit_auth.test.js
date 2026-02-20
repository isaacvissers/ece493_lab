import { createScheduleEditView } from '../../src/views/schedule_edit_view.js';
import { createScheduleEditController } from '../../src/controllers/schedule_edit_controller.js';
import { auditLogService } from '../../src/services/audit_log_service.js';
import { sessionState } from '../../src/models/session-state.js';

beforeEach(() => {
  auditLogService.reset();
  sessionState.clear();
  document.body.innerHTML = '';
});

test('logs denial when unauthorized user attempts to edit', () => {
  const scheduleService = { getDraftSchedule: () => null };
  sessionState.authenticate({ id: 'acct_author', role: 'Author' });
  const view = createScheduleEditView();
  document.body.appendChild(view.element);
  const controller = createScheduleEditController({
    view,
    sessionState,
    scheduleService,
    auditLogService,
  });
  controller.show('conf_auth');

  const logs = auditLogService.getLogs();
  expect(logs[0].eventType).toBe('schedule_edit_denied');
  expect(view.element.textContent).toContain('Access denied');
});
