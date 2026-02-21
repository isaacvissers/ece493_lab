import { registrationLogService } from '../../src/services/registration_log_service.js';

beforeEach(() => {
  registrationLogService.reset();
});

test('prunes registration logs older than 90 days', () => {
  const now = Date.now();
  const oldDate = new Date(now - 120 * 24 * 60 * 60 * 1000).toISOString();
  const recentDate = new Date(now - 10 * 24 * 60 * 60 * 1000).toISOString();
  registrationLogService.log({ registrationId: 'reg_old', event: 'save_failure', createdAt: oldDate });
  registrationLogService.log({ registrationId: 'reg_new', event: 'notification_failure', createdAt: recentDate });
  const remaining = registrationLogService.pruneOlderThan(90, now);
  expect(remaining).toHaveLength(1);
  expect(remaining[0].registrationId).toBe('reg_new');
});
