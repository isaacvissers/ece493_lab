import { auditLogService } from '../../src/services/audit_log_service.js';

beforeEach(() => {
  auditLogService.reset();
});

test('logs schedule save failure events', () => {
  auditLogService.log({ eventType: 'schedule_save_failed', relatedId: 'conf_1', details: { message: 'fail' } });
  const logs = auditLogService.getLogs();
  expect(logs.length).toBe(1);
  expect(logs[0].eventType).toBe('schedule_save_failed');
  expect(logs[0].relatedId).toBe('conf_1');
});

test('logs schedule publish failure events', () => {
  auditLogService.log({ eventType: 'schedule_publish_failed', relatedId: 'conf_2', details: { message: 'fail' } });
  const logs = auditLogService.getLogs();
  expect(logs[0].eventType).toBe('schedule_publish_failed');
});
