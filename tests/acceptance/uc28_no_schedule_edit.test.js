import { createScheduleEditView } from '../../src/views/schedule_edit_view.js';
import { createScheduleEditController } from '../../src/controllers/schedule_edit_controller.js';
import { scheduleRepository } from '../../src/services/schedule_repository.js';
import { scheduleService } from '../../src/services/schedule_service.js';
import { auditLogService } from '../../src/services/audit_log_service.js';
import { notificationService } from '../../src/services/notification_service.js';
import { sessionState } from '../../src/models/session-state.js';

beforeEach(() => {
  scheduleRepository.reset();
  auditLogService.reset();
  notificationService.reset();
  sessionState.clear();
  document.body.innerHTML = '';
});

test('shows no schedule available and disables editing', () => {
  sessionState.authenticate({ id: 'acct_editor', role: 'Editor' });
  const view = createScheduleEditView();
  document.body.appendChild(view.element);
  const controller = createScheduleEditController({
    view,
    sessionState,
    scheduleService,
    auditLogService,
    notificationService,
  });
  controller.show('conf_missing');

  expect(view.element.textContent).toContain('No schedule available');
  expect(view.element.querySelector('#editEntryId').disabled).toBe(true);
});
