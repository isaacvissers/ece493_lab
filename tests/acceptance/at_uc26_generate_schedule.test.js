import { createScheduleDraftView } from '../../src/views/schedule_draft_view.js';
import { createScheduleController } from '../../src/controllers/schedule_controller.js';
import { scheduleRepository } from '../../src/services/schedule_repository.js';
import { auditLogService } from '../../src/services/audit_log_service.js';
import { sessionState } from '../../src/models/session-state.js';

function setup({ withAudit = false } = {}) {
  const view = createScheduleDraftView();
  document.body.appendChild(view.element);
  const controller = createScheduleController({ view, sessionState, auditLogService: withAudit ? auditLogService : undefined });
  controller.init();
  return { view, controller };
}

function setValues(view, overrides = {}) {
  view.element.querySelector('#conferenceId').value = overrides.conferenceId || 'conf_default';
  view.element.querySelector('#startDate').value = overrides.startDate || '2026-05-01T09:00';
  view.element.querySelector('#endDate').value = overrides.endDate || '2026-05-01T10:00';
  view.element.querySelector('#slotDurationMinutes').value = overrides.slotDurationMinutes || '30';
  view.element.querySelector('#rooms').value = overrides.rooms || 'Room A | 100';
}

function submit(view) {
  const event = new Event('submit', { bubbles: true, cancelable: true });
  view.element.querySelector('form').dispatchEvent(event);
}

beforeEach(() => {
  scheduleRepository.reset();
  auditLogService.reset();
  sessionState.clear();
  document.body.innerHTML = '';
});

test('AT-UC26-01: generates a draft schedule for accepted papers', () => {
  scheduleRepository.savePapers([
    { paperId: 'p1', status: 'accepted', requiredMetadataComplete: true, conferenceId: 'conf_accept' },
  ]);
  sessionState.authenticate({ id: 'acct_admin', email: 'admin@example.com', role: 'Admin' });
  const { view } = setup();
  setValues(view, { conferenceId: 'conf_accept' });
  submit(view);
  const listText = view.element.querySelector('#schedule-list').textContent;
  expect(listText).toContain('p1');
  expect(view.element.querySelector('#schedule-status').textContent).toContain('Draft schedule generated');
});

test('AT-UC26-02: draft schedule can be reopened for review', () => {
  scheduleRepository.savePapers([
    { paperId: 'p1', status: 'accepted', requiredMetadataComplete: true, conferenceId: 'conf_persist' },
  ]);
  sessionState.authenticate({ id: 'acct_admin', email: 'admin@example.com', role: 'Admin' });
  const { view, controller } = setup();
  setValues(view, { conferenceId: 'conf_persist' });
  submit(view);

  document.body.innerHTML = '';
  const second = setup();
  const result = second.controller.loadDraft('conf_persist');
  expect(result.ok).toBe(true);
  const listText = second.view.element.querySelector('#schedule-list').textContent;
  expect(listText).toContain('p1');
});

test('AT-UC26-03: missing inputs block generation with errors', () => {
  sessionState.authenticate({ id: 'acct_admin', email: 'admin@example.com', role: 'Admin' });
  const { view } = setup();
  view.element.querySelector('#conferenceId').value = '';
  view.element.querySelector('#startDate').value = '';
  view.element.querySelector('#endDate').value = '';
  view.element.querySelector('#slotDurationMinutes').value = '';
  view.element.querySelector('#rooms').value = '';
  submit(view);
  expect(view.element.querySelector('#conferenceId-error').textContent).toContain('required');
  expect(view.element.querySelector('#startDate-error').textContent).toContain('valid');
  expect(view.element.querySelector('#rooms-error').textContent).toContain('required');
  expect(view.element.querySelector('#schedule-status').textContent).toContain('Fix highlighted');
});

test('AT-UC26-04: capacity shortfall flags unscheduled papers', () => {
  scheduleRepository.savePapers([
    { paperId: 'p1', status: 'accepted', requiredMetadataComplete: true, conferenceId: 'conf_short' },
    { paperId: 'p2', status: 'accepted', requiredMetadataComplete: true, conferenceId: 'conf_short' },
  ]);
  sessionState.authenticate({ id: 'acct_admin', email: 'admin@example.com', role: 'Admin' });
  const { view } = setup();
  setValues(view, { conferenceId: 'conf_short', endDate: '2026-05-01T09:30' });
  submit(view);
  const unscheduledText = view.element.querySelector('#schedule-unscheduled').textContent;
  expect(unscheduledText).toContain('capacity_shortfall');
  expect(view.element.querySelector('#schedule-status').textContent).toContain('unscheduled');
});

test('AT-UC26-05: missing metadata papers are excluded and flagged', () => {
  scheduleRepository.savePapers([
    { paperId: 'p1', status: 'accepted', requiredMetadataComplete: false, conferenceId: 'conf_meta' },
  ]);
  sessionState.authenticate({ id: 'acct_admin', email: 'admin@example.com', role: 'Admin' });
  const { view } = setup();
  setValues(view, { conferenceId: 'conf_meta' });
  submit(view);
  const unscheduledText = view.element.querySelector('#schedule-unscheduled').textContent;
  expect(unscheduledText).toContain('missing_metadata');
});

test('AT-UC26-06: save draft persists schedule state', () => {
  scheduleRepository.savePapers([
    { paperId: 'p1', status: 'accepted', requiredMetadataComplete: true, conferenceId: 'conf_save' },
  ]);
  sessionState.authenticate({ id: 'acct_admin', email: 'admin@example.com', role: 'Admin' });
  const { view } = setup();
  setValues(view, { conferenceId: 'conf_save' });
  submit(view);
  view.element.querySelector('#schedule-save').click();
  const schedule = scheduleRepository.getSchedule('conf_save');
  expect(schedule.status).toBe('saved');
});

test('AT-UC26-07: save failure shows error and logs', () => {
  scheduleRepository.savePapers([
    { paperId: 'p1', status: 'accepted', requiredMetadataComplete: true, conferenceId: 'conf_save_fail' },
  ]);
  sessionState.authenticate({ id: 'acct_admin', email: 'admin@example.com', role: 'Admin' });
  const { view } = setup({ withAudit: true });
  setValues(view, { conferenceId: 'conf_save_fail' });
  submit(view);
  scheduleRepository.setFailureMode(true);
  view.element.querySelector('#schedule-save').click();
  expect(view.element.querySelector('#schedule-status').textContent).toContain('Save failed');
  expect(auditLogService.getLogs()[0].eventType).toBe('schedule_save_failed');
  scheduleRepository.setFailureMode(false);
});

test('AT-UC26-08: publish failure logs and preserves saved schedule', () => {
  scheduleRepository.savePapers([
    { paperId: 'p1', status: 'accepted', requiredMetadataComplete: true, conferenceId: 'conf_publish_fail' },
  ]);
  sessionState.authenticate({ id: 'acct_admin', email: 'admin@example.com', role: 'Admin' });
  const { view } = setup({ withAudit: true });
  setValues(view, { conferenceId: 'conf_publish_fail' });
  submit(view);
  view.element.querySelector('#schedule-save').click();
  scheduleRepository.setFailureMode(true);
  view.element.querySelector('#schedule-publish').click();
  const schedule = scheduleRepository.getSchedule('conf_publish_fail');
  expect(schedule.status).toBe('saved');
  expect(auditLogService.getLogs()[0].eventType).toBe('schedule_publish_failed');
  scheduleRepository.setFailureMode(false);
});
