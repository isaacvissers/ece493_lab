import { createScheduleHtmlView } from '../../src/views/schedule_html_view.js';
import { createScheduleHtmlController } from '../../src/controllers/schedule_html_controller.js';
import { auditLogService } from '../../src/services/audit_log_service.js';
import { scheduleRepository } from '../../src/services/schedule_repository.js';
import { sessionState } from '../../src/models/session-state.js';

beforeEach(() => {
  auditLogService.reset();
  scheduleRepository.reset();
  sessionState.clear();
  document.body.innerHTML = '';
});

test('denies unauthenticated access and logs', () => {
  const scheduleService = { getPublishedSchedule: () => null };
  const view = createScheduleHtmlView();
  document.body.appendChild(view.element);
  const controller = createScheduleHtmlController({
    view,
    sessionState,
    scheduleService,
    auditLogService,
  });
  controller.show('conf_private');
  expect(view.element.textContent).toContain('Access denied');
  const logs = auditLogService.getLogs();
  expect(logs[0].eventType).toBe('schedule_view_denied');
});

test('logs render failure with fallback message', () => {
  const scheduleService = {
    getPublishedSchedule: () => ({ schedule: { scheduleId: 'sched_fail', status: 'published' }, items: [] }),
  };
  const scheduleRenderer = {
    renderAgenda: () => {
      throw {};
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
  const logs = auditLogService.getLogs();
  expect(logs[0].details.message).toBe('render_failed');
});

test('uses default services when not provided', () => {
  const draft = scheduleRepository.saveDraft({
    conferenceId: 'conf_default',
    items: [
      { paperTitle: 'Paper Default', roomName: 'Room A', startTime: '2026-05-01T09:00:00.000Z', endTime: '2026-05-01T09:30:00.000Z', status: 'scheduled' },
    ],
  });
  scheduleRepository.publishSchedule({ conferenceId: draft.conferenceId });
  sessionState.authenticate({ id: 'acct_admin', role: 'Admin' });
  const view = createScheduleHtmlView();
  document.body.appendChild(view.element);
  const controller = createScheduleHtmlController({ view, sessionState });
  controller.show('conf_default');
  expect(view.element.textContent).toContain('Paper Default');
});

test('creates controller with defaults when no options provided', () => {
  const controller = createScheduleHtmlController();
  expect(controller.view).toBeUndefined();
  expect(typeof controller.show).toBe('function');
});
