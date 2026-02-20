import { jest } from '@jest/globals';
import { createScheduleDraftView } from '../../src/views/schedule_draft_view.js';
import { createScheduleController } from '../../src/controllers/schedule_controller.js';
import { scheduleRepository } from '../../src/services/schedule_repository.js';
import { auditLogService } from '../../src/services/audit_log_service.js';
import { sessionState } from '../../src/models/session-state.js';

function setup() {
  const view = createScheduleDraftView();
  document.body.appendChild(view.element);
  const controller = createScheduleController({ view, sessionState });
  controller.init();
  return { view };
}

function setValues(view) {
  view.element.querySelector('#conferenceId').value = 'conf_empty';
  view.element.querySelector('#startDate').value = '2026-05-01T09:00';
  view.element.querySelector('#endDate').value = '2026-05-01T10:00';
  view.element.querySelector('#slotDurationMinutes').value = '30';
  view.element.querySelector('#rooms').value = 'Room A | 100';
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

test('blocks unauthenticated users', () => {
  const { view } = setup();
  setValues(view);
  submit(view);
  expect(view.element.querySelector('#schedule-status').textContent).toContain('permission');
  expect(view.element.querySelector('#conferenceId').disabled).toBe(true);
});

test('handles empty accepted paper list with message', () => {
  sessionState.authenticate({ id: 'acct_admin', email: 'admin@example.com', role: 'Admin' });
  const { view } = setup();
  setValues(view);
  submit(view);
  expect(view.element.querySelector('#schedule-status').textContent).toContain('No accepted papers');
});

test('save requires conference id', () => {
  sessionState.authenticate({ id: 'acct_admin', email: 'admin@example.com', role: 'Admin' });
  const { view } = setup();
  view.element.querySelector('#conferenceId').value = '';
  view.element.querySelector('#schedule-save').click();
  expect(view.element.querySelector('#schedule-status').textContent).toContain('conference ID');
});

test('publish requires conference id', () => {
  sessionState.authenticate({ id: 'acct_admin', email: 'admin@example.com', role: 'Admin' });
  const { view } = setup();
  view.element.querySelector('#conferenceId').value = '';
  view.element.querySelector('#schedule-publish').click();
  expect(view.element.querySelector('#schedule-status').textContent).toContain('conference ID');
});

test('blocks non-admin users and logs access denial', () => {
  sessionState.authenticate({ id: 'acct_user', email: 'user@example.com', role: 'Author' });
  const { view } = setup();
  setValues(view);
  submit(view);
  expect(view.element.querySelector('#schedule-status').textContent).toContain('permission');
  expect(auditLogService.getLogs()[0].eventType).toBe('access_denied');
});

test('shows validation errors for invalid inputs', () => {
  sessionState.authenticate({ id: 'acct_admin', email: 'admin@example.com', role: 'Admin' });
  const { view } = setup();
  view.element.querySelector('#conferenceId').value = 'conf_bad';
  view.element.querySelector('#startDate').value = 'invalid';
  view.element.querySelector('#endDate').value = '';
  view.element.querySelector('#slotDurationMinutes').value = '0';
  view.element.querySelector('#rooms').value = '';
  submit(view);
  expect(view.element.querySelector('#startDate-error').textContent).toContain('valid');
  expect(view.element.querySelector('#rooms-error').textContent).toContain('required');
});

test('maps required validation errors to required message', () => {
  const scheduleValidation = {
    validateInputs: () => ({ ok: false, errors: { conferenceId: 'required' } }),
  };
  sessionState.authenticate({ id: 'acct_admin', email: 'admin@example.com', role: 'Admin' });
  const view = createScheduleDraftView();
  document.body.appendChild(view.element);
  const controller = createScheduleController({ view, sessionState, scheduleValidation });
  controller.init();
  submit(view);
  expect(view.element.querySelector('#conferenceId-error').textContent).toBe('This field is required.');
});

test('handles validation failure without explicit errors', () => {
  const scheduleValidation = {
    validateInputs: () => ({ ok: false }),
  };
  sessionState.authenticate({ id: 'acct_admin', email: 'admin@example.com', role: 'Admin' });
  const view = createScheduleDraftView();
  document.body.appendChild(view.element);
  const controller = createScheduleController({ view, sessionState, scheduleValidation });
  controller.init();
  submit(view);
  expect(view.element.querySelector('#schedule-status').textContent).toContain('Fix highlighted');
});

test('builds room ids from fallback when room name missing', () => {
  const scheduleValidation = {
    validateInputs: () => ({
      ok: true,
      values: {
        conferenceId: 'conf_rooms',
        dateRange: { start: '2026-05-01T09:00', end: '2026-05-01T10:00' },
        rooms: [{ name: '', capacity: 50 }],
        slotDurationMinutes: 30,
      },
    }),
  };
  const scheduleRepositoryStub = {
    saveConference: jest.fn(),
    getAcceptedPapers: () => [],
    saveDraft: () => {},
  };
  const scheduleGenerator = { generate: () => ({ ok: true, items: [], unscheduled: [], totalAccepted: 0 }) };
  sessionState.authenticate({ id: 'acct_admin', email: 'admin@example.com', role: 'Admin' });
  const view = createScheduleDraftView();
  document.body.appendChild(view.element);
  const controller = createScheduleController({
    view,
    sessionState,
    scheduleValidation,
    scheduleRepository: scheduleRepositoryStub,
    scheduleGenerator,
  });
  controller.init();
  submit(view);
  const savedConference = scheduleRepositoryStub.saveConference.mock.calls[0][0];
  expect(savedConference.rooms[0].roomId).toBe('room_1');
});

test('creates controller with default options when no args provided', () => {
  const controller = createScheduleController();
  expect(controller.view).toBeUndefined();
});

test('schedule draft view ignores unknown field errors', () => {
  const view = createScheduleDraftView();
  document.body.appendChild(view.element);
  expect(() => view.setFieldError('unknown_field', 'Nope')).not.toThrow();
});

test('schedule draft view defaults status and draft content', () => {
  const view = createScheduleDraftView();
  document.body.appendChild(view.element);
  view.setStatus('', false);
  expect(view.element.querySelector('#schedule-status').className).toBe('status');
  view.setStatus(null, false);
  view.setDraft();
  expect(view.element.querySelector('#schedule-summary').textContent).toBe('');
});

test('marks unscheduled papers with a warning status', () => {
  scheduleRepository.savePapers([
    { paperId: 'p1', status: 'accepted', requiredMetadataComplete: true, conferenceId: 'conf_warn' },
    { paperId: 'p2', status: 'accepted', requiredMetadataComplete: true, conferenceId: 'conf_warn' },
  ]);
  sessionState.authenticate({ id: 'acct_admin', email: 'admin@example.com', role: 'Admin' });
  const { view } = setup();
  view.element.querySelector('#conferenceId').value = 'conf_warn';
  view.element.querySelector('#startDate').value = '2026-05-01T09:00';
  view.element.querySelector('#endDate').value = '2026-05-01T09:30';
  view.element.querySelector('#slotDurationMinutes').value = '30';
  view.element.querySelector('#rooms').value = 'Room A | 100';
  submit(view);
  expect(view.element.querySelector('#schedule-status').textContent).toContain('unscheduled');
});

test('save and publish are blocked when unauthenticated', () => {
  const { view } = setup();
  view.element.querySelector('#schedule-save').click();
  expect(view.element.querySelector('#schedule-status').textContent).toContain('permission');
  view.element.querySelector('#schedule-publish').click();
  expect(view.element.querySelector('#schedule-status').textContent).toContain('permission');
});

test('publish blocks unauthenticated users before any save attempt', () => {
  const { view } = setup();
  view.element.querySelector('#schedule-publish').click();
  expect(view.element.querySelector('#schedule-status').textContent).toContain('permission');
  expect(view.element.querySelector('#conferenceId').disabled).toBe(true);
});

test('loadDraft returns not_found for missing schedule', () => {
  const { controller } = (() => {
    const v = createScheduleDraftView();
    document.body.appendChild(v.element);
    const c = createScheduleController({ view: v, sessionState });
    c.init();
    return { controller: c };
  })();
  const result = controller.loadDraft('missing');
  expect(result.ok).toBe(false);
});

test('save and publish succeed with valid schedule', () => {
  scheduleRepository.savePapers([
    { paperId: 'p1', status: 'accepted', requiredMetadataComplete: true, conferenceId: 'conf_ok' },
  ]);
  sessionState.authenticate({ id: 'acct_admin', email: 'admin@example.com', role: 'Admin' });
  const { view } = setup();
  view.element.querySelector('#conferenceId').value = 'conf_ok';
  view.element.querySelector('#startDate').value = '2026-05-01T09:00';
  view.element.querySelector('#endDate').value = '2026-05-01T10:00';
  view.element.querySelector('#slotDurationMinutes').value = '30';
  view.element.querySelector('#rooms').value = 'Room A | 100';
  submit(view);
  view.element.querySelector('#schedule-save').click();
  expect(view.element.querySelector('#schedule-status').textContent).toContain('saved');
  view.element.querySelector('#schedule-publish').click();
  expect(view.element.querySelector('#schedule-status').textContent).toContain('published');
});

test('save failure logs audit entry', () => {
  const scheduleRepositoryStub = {
    saveSchedule: () => { throw new Error('save_failed'); },
    getAcceptedPapers: () => [],
    saveConference: () => {},
    saveDraft: () => {},
  };
  sessionState.authenticate({ id: 'acct_admin', email: 'admin@example.com', role: 'Admin' });
  const view = createScheduleDraftView();
  document.body.appendChild(view.element);
  const controller = createScheduleController({
    view,
    sessionState,
    scheduleRepository: scheduleRepositoryStub,
    auditLogService,
  });
  controller.init();
  view.element.querySelector('#conferenceId').value = 'conf_fail';
  view.element.querySelector('#schedule-save').click();
  expect(auditLogService.getLogs()[0].eventType).toBe('schedule_save_failed');
});

test('save failure without message uses fallback', () => {
  const scheduleRepositoryStub = {
    saveSchedule: () => { throw {}; },
    getAcceptedPapers: () => [],
    saveConference: () => {},
    saveDraft: () => {},
  };
  sessionState.authenticate({ id: 'acct_admin', email: 'admin@example.com', role: 'Admin' });
  const view = createScheduleDraftView();
  document.body.appendChild(view.element);
  const controller = createScheduleController({
    view,
    sessionState,
    scheduleRepository: scheduleRepositoryStub,
    auditLogService,
  });
  controller.init();
  view.element.querySelector('#conferenceId').value = 'conf_fail';
  view.element.querySelector('#schedule-save').click();
  expect(auditLogService.getLogs()[0].details.message).toBe('save_failed');
});

test('publish failure logs audit entry', () => {
  const scheduleRepositoryStub = {
    publishSchedule: () => { throw new Error('publish_failed'); },
    getAcceptedPapers: () => [],
    saveConference: () => {},
    saveDraft: () => {},
  };
  sessionState.authenticate({ id: 'acct_admin', email: 'admin@example.com', role: 'Admin' });
  const view = createScheduleDraftView();
  document.body.appendChild(view.element);
  const controller = createScheduleController({
    view,
    sessionState,
    scheduleRepository: scheduleRepositoryStub,
    auditLogService,
  });
  controller.init();
  view.element.querySelector('#conferenceId').value = 'conf_fail';
  view.element.querySelector('#schedule-publish').click();
  expect(auditLogService.getLogs()[0].eventType).toBe('schedule_publish_failed');
});

test('publish failure without message uses fallback', () => {
  const scheduleRepositoryStub = {
    publishSchedule: () => { throw {}; },
    getAcceptedPapers: () => [],
    saveConference: () => {},
    saveDraft: () => {},
  };
  sessionState.authenticate({ id: 'acct_admin', email: 'admin@example.com', role: 'Admin' });
  const view = createScheduleDraftView();
  document.body.appendChild(view.element);
  const controller = createScheduleController({
    view,
    sessionState,
    scheduleRepository: scheduleRepositoryStub,
    auditLogService,
  });
  controller.init();
  view.element.querySelector('#conferenceId').value = 'conf_fail';
  view.element.querySelector('#schedule-publish').click();
  expect(auditLogService.getLogs()[0].details.message).toBe('publish_failed');
});

test('loadDraft returns items for existing schedule', () => {
  scheduleRepository.saveDraft({
    conferenceId: 'conf_load',
    items: [{ paperId: 'p1', status: 'scheduled' }, { paperId: 'p2', status: 'unscheduled' }],
  });
  const view = createScheduleDraftView();
  document.body.appendChild(view.element);
  const controller = createScheduleController({ view, sessionState });
  controller.init();
  const result = controller.loadDraft('conf_load');
  expect(result.ok).toBe(true);
  expect(view.element.querySelector('#schedule-unscheduled').textContent).toContain('p2');
});

test('reports schedule generation timeout', () => {
  const view = createScheduleDraftView();
  document.body.appendChild(view.element);
  const scheduleGenerator = { generate: () => ({ ok: false, reason: 'generation_timeout' }) };
  const controller = createScheduleController({ view, sessionState, scheduleGenerator });
  controller.init();
  sessionState.authenticate({ id: 'acct_admin', email: 'admin@example.com', role: 'Admin' });
  setValues(view);
  submit(view);
  expect(view.element.querySelector('#schedule-status').textContent).toContain('too long');
});

test('reports schedule generation conflict', () => {
  const view = createScheduleDraftView();
  document.body.appendChild(view.element);
  const scheduleGenerator = { generate: () => ({ ok: false, reason: 'conflict' }) };
  const controller = createScheduleController({ view, sessionState, scheduleGenerator });
  controller.init();
  sessionState.authenticate({ id: 'acct_admin', email: 'admin@example.com', role: 'Admin' });
  setValues(view);
  submit(view);
  expect(view.element.querySelector('#schedule-status').textContent).toContain('conflict');
});

test('reports generic schedule generation failure', () => {
  const view = createScheduleDraftView();
  document.body.appendChild(view.element);
  const scheduleGenerator = { generate: () => ({ ok: false, reason: 'unknown' }) };
  const controller = createScheduleController({ view, sessionState, scheduleGenerator });
  controller.init();
  sessionState.authenticate({ id: 'acct_admin', email: 'admin@example.com', role: 'Admin' });
  setValues(view);
  submit(view);
  expect(view.element.querySelector('#schedule-status').textContent).toContain('Unable to generate');
});

test('defaults missing schedule items to empty arrays', () => {
  const view = createScheduleDraftView();
  document.body.appendChild(view.element);
  const scheduleGenerator = { generate: () => ({ ok: true, totalAccepted: 0 }) };
  const scheduleRepositoryStub = {
    saveConference: () => {},
    getAcceptedPapers: () => [],
    saveDraft: jest.fn(),
  };
  const controller = createScheduleController({
    view,
    sessionState,
    scheduleGenerator,
    scheduleRepository: scheduleRepositoryStub,
  });
  controller.init();
  sessionState.authenticate({ id: 'acct_admin', email: 'admin@example.com', role: 'Admin' });
  setValues(view);
  submit(view);
  const savedItems = scheduleRepositoryStub.saveDraft.mock.calls[0][0].items;
  expect(savedItems).toEqual([]);
});
