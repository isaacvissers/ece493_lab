import { auditLogService } from '../../src/services/audit_log_service.js';

beforeEach(() => {
  auditLogService.reset();
});

test('prunes audit logs older than 90 days', () => {
  const now = Date.now();
  const oldDate = new Date(now - 100 * 24 * 60 * 60 * 1000).toISOString();
  const recentDate = new Date(now - 10 * 24 * 60 * 60 * 1000).toISOString();
  auditLogService.log({ eventType: 'schedule_view_denied', relatedId: 'conf_old', createdAt: oldDate });
  auditLogService.log({ eventType: 'schedule_view_denied', relatedId: 'conf_recent', createdAt: recentDate });
  const remaining = auditLogService.pruneOlderThan(90, now);
  expect(remaining.length).toBe(1);
  expect(remaining[0].relatedId).toBe('conf_recent');
});
