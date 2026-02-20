import { auditLogService } from '../../src/services/audit_log_service.js';

beforeEach(() => {
  auditLogService.reset();
});

test('audit log service stores entries', () => {
  auditLogService.log({ eventType: 'access_denied', relatedId: 'paper_1' });
  const logs = auditLogService.getLogs();
  expect(logs).toHaveLength(1);
  expect(logs[0].eventType).toBe('access_denied');
});

test('audit log service reset clears logs', () => {
  auditLogService.log({ eventType: 'reset', relatedId: 'paper_2' });
  auditLogService.reset();
  expect(auditLogService.getLogs()).toHaveLength(0);
});

test('audit log service prunes old entries', () => {
  auditLogService.log({ eventType: 'old', relatedId: 'paper_old', details: {}, createdAt: '2000-01-01T00:00:00.000Z' });
  auditLogService.log({ eventType: 'new', relatedId: 'paper_new' });
  const pruned = auditLogService.pruneOlderThan(1, Date.now());
  expect(pruned.some((log) => log.eventType === 'old')).toBe(false);
});

test('audit log service keeps entries with invalid dates', () => {
  auditLogService.log({ eventType: 'bad', relatedId: 'paper_bad', details: {}, createdAt: 'invalid' });
  const pruned = auditLogService.pruneOlderThan(1, Date.now());
  expect(pruned).toHaveLength(1);
});

test('audit log service records schedule-specific events', () => {
  auditLogService.logScheduleViewDenied({ conferenceId: 'conf_1', userId: 'user_1' });
  auditLogService.logScheduleRenderFailed({ conferenceId: 'conf_2', message: 'fail' });
  auditLogService.logScheduleTimeout({ conferenceId: 'conf_3', durationMs: 2500 });
  const logs = auditLogService.getLogs();
  expect(logs[0].eventType).toBe('schedule_view_denied');
  expect(logs[1].eventType).toBe('schedule_render_failed');
  expect(logs[2].eventType).toBe('schedule_timeout');
});

test('schedule log helpers use default values when missing', () => {
  auditLogService.logScheduleViewDenied();
  auditLogService.logScheduleRenderFailed();
  auditLogService.logScheduleTimeout();
  const logs = auditLogService.getLogs();
  expect(logs[0].relatedId).toBe('schedule');
  expect(logs[1].details.message).toBeUndefined();
  expect(logs[2].details.durationMs).toBeUndefined();
});

test('schedule edit log helpers record events', () => {
  auditLogService.logScheduleEditDenied({ conferenceId: 'conf_1', userId: 'user_1' });
  auditLogService.logScheduleEditFailed({ conferenceId: 'conf_2', entryId: 'entry_2', message: 'fail' });
  auditLogService.logScheduleConflict({ conferenceId: 'conf_3', entryId: 'entry_3', conflictEntryId: 'entry_4' });
  auditLogService.logScheduleConcurrency({ conferenceId: 'conf_4', expectedVersion: 1, actualVersion: 2 });
  auditLogService.logScheduleNotificationFailed({ conferenceId: 'conf_5', entryId: 'entry_5', message: 'notify_fail' });
  const logs = auditLogService.getLogs();
  expect(logs[0].eventType).toBe('schedule_edit_denied');
  expect(logs[1].eventType).toBe('schedule_edit_failed');
  expect(logs[2].eventType).toBe('schedule_conflict');
  expect(logs[3].eventType).toBe('schedule_concurrency');
  expect(logs[4].eventType).toBe('schedule_notification_failed');
});

test('schedule edit log helpers use default values when missing', () => {
  auditLogService.logScheduleEditDenied();
  auditLogService.logScheduleEditFailed();
  auditLogService.logScheduleConflict();
  auditLogService.logScheduleConcurrency();
  auditLogService.logScheduleNotificationFailed();
  const logs = auditLogService.getLogs();
  expect(logs[0].relatedId).toBe('schedule');
  expect(logs[1].details.entryId).toBeUndefined();
  expect(logs[2].details.conflictEntryId).toBeUndefined();
  expect(logs[3].details.expectedVersion).toBeUndefined();
  expect(logs[4].details.message).toBeUndefined();
});
