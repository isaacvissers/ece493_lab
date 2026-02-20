import { jest } from '@jest/globals';
import { createScheduleEditView } from '../../src/views/schedule_edit_view.js';
import { createScheduleEditController } from '../../src/controllers/schedule_edit_controller.js';
import { auditLogService } from '../../src/services/audit_log_service.js';
import { notificationService } from '../../src/services/notification_service.js';

function buildAuthService({ ok = true, isAllowed = true } = {}) {
  return {
    requireAuth: () => (ok ? { ok: true, user: { id: 'acct_1', role: 'Editor' } } : { ok: false }),
    isAdminOrEditor: () => isAllowed,
  };
}

function fillValues(view, values = {}) {
  view.element.querySelector('#editConferenceId').value = values.conferenceId || '';
  view.element.querySelector('#editEntryId').value = values.entryId || '';
  view.element.querySelector('#editRoomId').value = values.roomId || '';
  view.element.querySelector('#editStartTime').value = values.startTime || '';
  view.element.querySelector('#editEndTime').value = values.endTime || '';
  view.element.querySelector('#editScheduleVersion').value = values.scheduleVersion || '';
}

beforeEach(() => {
  auditLogService.reset();
  notificationService.reset();
  document.body.innerHTML = '';
});

test('show denies unauthenticated users', () => {
  const view = createScheduleEditView();
  document.body.appendChild(view.element);
  const controller = createScheduleEditController({
    view,
    authService: buildAuthService({ ok: false }),
    scheduleService: { getDraftSchedule: () => null },
    auditLogService,
  });
  controller.show('conf_auth');
  expect(view.element.textContent).toContain('Access denied');
});

test('show handles missing schedule', () => {
  const view = createScheduleEditView();
  document.body.appendChild(view.element);
  const controller = createScheduleEditController({
    view,
    authService: buildAuthService(),
    scheduleService: { getDraftSchedule: () => null },
    auditLogService,
  });
  controller.show('conf_missing');
  expect(view.element.textContent).toContain('No schedule available');
  expect(view.element.querySelector('#editEntryId').disabled).toBe(true);
});

test('show renders draft schedule summary and version', () => {
  const view = createScheduleEditView();
  document.body.appendChild(view.element);
  const controller = createScheduleEditController({
    view,
    authService: buildAuthService(),
    scheduleService: {
      getDraftSchedule: () => ({
        schedule: { version: 3 },
        entries: [{ entryId: 'entry_1', paperId: 'paper_1', roomId: 'room_a', startTime: '2026-05-01T09:00:00.000Z', endTime: '2026-05-01T09:30:00.000Z' }],
      }),
    },
    auditLogService,
  });
  controller.show('conf_ok');
  expect(view.element.textContent).toContain('Draft schedule version 3');
  expect(view.element.querySelector('#editScheduleVersion').value).toBe('3');
});

test('show falls back to version 1 when missing', () => {
  const view = createScheduleEditView();
  document.body.appendChild(view.element);
  const controller = createScheduleEditController({
    view,
    authService: buildAuthService(),
    scheduleService: {
      getDraftSchedule: () => ({
        schedule: { version: 0 },
        entries: [],
      }),
    },
    auditLogService,
  });
  controller.show('conf_ok');
  expect(view.element.textContent).toContain('Draft schedule version 1');
});

test('show logs denial with fallback userId', () => {
  const view = createScheduleEditView();
  document.body.appendChild(view.element);
  const controller = createScheduleEditController({
    view,
    authService: {
      requireAuth: () => ({ ok: true, user: { userId: 'acct_fallback', role: 'Author' } }),
      isAdminOrEditor: () => false,
    },
    scheduleService: { getDraftSchedule: () => null },
    auditLogService,
  });
  controller.show('conf_denied');
  const logs = auditLogService.getLogs();
  expect(logs[0].details.userId).toBe('acct_fallback');
});

test('show logs denial when user is null', () => {
  const view = createScheduleEditView();
  document.body.appendChild(view.element);
  const controller = createScheduleEditController({
    view,
    authService: {
      requireAuth: () => ({ ok: true, user: null }),
      isAdminOrEditor: () => false,
    },
    scheduleService: { getDraftSchedule: () => null },
    auditLogService,
  });
  controller.show('conf_denied');
  const logs = auditLogService.getLogs();
  expect(logs[0].details.userId).toBeNull();
});

test('save denies unauthorized users', () => {
  const view = createScheduleEditView();
  document.body.appendChild(view.element);
  const controller = createScheduleEditController({
    view,
    authService: buildAuthService({ isAllowed: false }),
    scheduleService: { updateScheduleEntry: () => ({ ok: true, schedule: { version: 1 }, entries: [] }) },
    auditLogService,
  });
  fillValues(view, { conferenceId: 'conf_1', entryId: 'entry_1', scheduleVersion: '1' });
  controller.save({ preventDefault: () => {} });
  expect(view.element.textContent).toContain('Access denied');
});

test('save validates required fields and version', () => {
  const view = createScheduleEditView();
  document.body.appendChild(view.element);
  const controller = createScheduleEditController({
    view,
    authService: buildAuthService(),
    scheduleService: { updateScheduleEntry: () => ({ ok: true, schedule: { version: 1 }, entries: [] }) },
    auditLogService,
  });
  fillValues(view, { conferenceId: '', entryId: '', scheduleVersion: '' });
  controller.save({ preventDefault: () => {} });
  expect(view.element.textContent).toContain('Complete all fields');

  fillValues(view, { conferenceId: 'conf_1', entryId: 'entry_1', scheduleVersion: '' });
  controller.save({ preventDefault: () => {} });
  expect(view.element.textContent).toContain('Complete all fields');

  fillValues(view, { conferenceId: '', entryId: 'entry_1', scheduleVersion: '1' });
  controller.save({ preventDefault: () => {} });
  expect(view.element.textContent).toContain('Complete all fields');

  fillValues(view, { conferenceId: 'conf_1', entryId: 'entry_1', scheduleVersion: '0' });
  controller.save({ preventDefault: () => {} });
  expect(view.element.textContent).toContain('Complete all fields');
});

test('save does not flag scheduleVersion when other required fields are missing', () => {
  const view = createScheduleEditView();
  document.body.appendChild(view.element);
  const updateScheduleEntry = jest.fn(() => ({ ok: true, schedule: { version: 1 }, entries: [] }));
  const controller = createScheduleEditController({
    view,
    authService: buildAuthService(),
    scheduleService: { updateScheduleEntry },
    auditLogService,
  });

  fillValues(view, { conferenceId: '', entryId: 'entry_1', scheduleVersion: '2' });
  controller.save({ preventDefault: () => {} });

  expect(view.element.textContent).toContain('Complete all fields');
  expect(view.element.querySelector('#editConferenceId-error').textContent).toBe('This field is required.');
  expect(view.element.querySelector('#editScheduleVersion-error').textContent).toBe('');
  expect(updateScheduleEntry).not.toHaveBeenCalled();
});

test.each([
  ['conflict', 'Conflict detected', { conflictEntry: { entryId: 'entry_9' } }],
  ['conflict', 'Conflict detected', {}],
  ['conflict', 'Conflict detected', { conflictEntry: { itemId: 'item_9' } }],
  ['outside_window', 'outside the conference window', {}],
  ['unscheduled', 'Entries must remain scheduled', {}],
  ['invalid_time', 'valid time range', {}],
  ['duplicate_paper', 'already scheduled', {}],
  ['version_conflict', 'Refresh', {}],
  ['save_failed', 'Save failed', {}],
  ['unknown', 'Unable to save schedule update', {}],
])('save handles %s responses', (reason, message, extra) => {
  const view = createScheduleEditView();
  document.body.appendChild(view.element);
  const controller = createScheduleEditController({
    view,
    authService: buildAuthService(),
    scheduleService: {
      updateScheduleEntry: () => ({ ok: false, reason, ...extra }),
    },
    auditLogService,
  });
  fillValues(view, {
    conferenceId: 'conf_1',
    entryId: 'entry_1',
    roomId: 'room_a',
    startTime: '2026-05-01T10:00',
    endTime: '2026-05-01T10:30',
    scheduleVersion: '1',
  });
  controller.save({ preventDefault: () => {} });
  expect(view.element.textContent).toContain(message);
});

test('save updates draft on success', () => {
  const view = createScheduleEditView();
  document.body.appendChild(view.element);
  const controller = createScheduleEditController({
    view,
    authService: buildAuthService(),
    scheduleService: {
      updateScheduleEntry: () => ({
        ok: true,
        schedule: { version: 4 },
        entries: [{ entryId: 'entry_1', paperId: 'paper_1', roomId: 'room_a', startTime: '2026-05-01T09:00:00.000Z', endTime: '2026-05-01T09:30:00.000Z' }],
      }),
    },
    auditLogService,
  });
  fillValues(view, {
    conferenceId: 'conf_1',
    entryId: 'entry_1',
    roomId: 'room_a',
    startTime: '2026-05-01T10:00',
    endTime: '2026-05-01T10:30',
    scheduleVersion: '3',
  });
  controller.save({ preventDefault: () => {} });
  expect(view.element.textContent).toContain('Schedule update saved');
  expect(view.element.querySelector('#editScheduleVersion').value).toBe('4');
});

test('save succeeds without entries payload', () => {
  const view = createScheduleEditView();
  document.body.appendChild(view.element);
  const controller = createScheduleEditController({
    view,
    authService: buildAuthService(),
    scheduleService: {
      updateScheduleEntry: () => ({
        ok: true,
        schedule: { version: 2 },
      }),
    },
    auditLogService,
  });
  fillValues(view, {
    conferenceId: 'conf_1',
    entryId: 'entry_1',
    roomId: 'room_a',
    startTime: '2026-05-01T10:00',
    endTime: '2026-05-01T10:30',
    scheduleVersion: '1',
  });
  controller.save({ preventDefault: () => {} });
  expect(view.element.textContent).toContain('Schedule update saved');
});

test('save without event still processes', () => {
  const view = createScheduleEditView();
  document.body.appendChild(view.element);
  const controller = createScheduleEditController({
    view,
    authService: buildAuthService(),
    scheduleService: {
      updateScheduleEntry: () => ({ ok: true, schedule: { version: 1 } }),
    },
    auditLogService,
  });
  fillValues(view, {
    conferenceId: 'conf_1',
    entryId: 'entry_1',
    roomId: 'room_a',
    startTime: '2026-05-01T10:00',
    endTime: '2026-05-01T10:30',
    scheduleVersion: '1',
  });
  controller.save();
  expect(view.element.textContent).toContain('Schedule update saved');
});

test('createScheduleEditController works with defaults', () => {
  const controller = createScheduleEditController();
  expect(typeof controller.show).toBe('function');
  expect(typeof controller.save).toBe('function');
});

test('save handles missing schedule response', () => {
  const view = createScheduleEditView();
  document.body.appendChild(view.element);
  const controller = createScheduleEditController({
    view,
    authService: buildAuthService(),
    scheduleService: {
      updateScheduleEntry: () => ({ ok: false, reason: 'not_found' }),
    },
    auditLogService,
  });
  fillValues(view, {
    conferenceId: 'conf_missing',
    entryId: 'entry_1',
    roomId: 'room_a',
    startTime: '2026-05-01T10:00',
    endTime: '2026-05-01T10:30',
    scheduleVersion: '1',
  });
  controller.save({ preventDefault: () => {} });
  expect(view.element.textContent).toContain('No schedule available');
});

test('init wires save handler', () => {
  const view = { onSave: jest.fn() };
  const controller = createScheduleEditController({ view });
  controller.init();
  expect(view.onSave).toHaveBeenCalledTimes(1);
});
