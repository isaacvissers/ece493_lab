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
