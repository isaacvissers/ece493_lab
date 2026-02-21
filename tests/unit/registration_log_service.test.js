import { registrationLogService } from '../../src/services/registration_log_service.js';

beforeEach(() => {
  registrationLogService.reset();
});

test('uses default log parameters and handles prune defaults', () => {
  registrationLogService.log();
  registrationLogService.logSaveFailure();
  registrationLogService.logNotificationFailure();

  const logs = registrationLogService.getLogs();
  expect(logs).toHaveLength(3);
  expect(logs[0].event).toBe('save_failure');
  expect(logs[1].event).toBe('save_failure');
  expect(logs[2].event).toBe('notification_failure');

  const pruned = registrationLogService.pruneOlderThan();
  expect(Array.isArray(pruned)).toBe(true);
});

test('pruneOlderThan keeps invalid timestamps', () => {
  const now = Date.now();
  const oldDate = new Date(now - 100 * 24 * 60 * 60 * 1000).toISOString();
  const recentDate = new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString();
  registrationLogService.log({ registrationId: 'reg_old', event: 'save_failure', createdAt: oldDate });
  registrationLogService.log({ registrationId: 'reg_recent', event: 'save_failure', createdAt: recentDate });
  registrationLogService.log({ registrationId: 'reg_invalid', event: 'save_failure', createdAt: 'not-a-date' });

  const remaining = registrationLogService.pruneOlderThan(90, now);
  expect(remaining.find((log) => log.registrationId === 'reg_invalid')).toBeTruthy();
  expect(remaining.find((log) => log.registrationId === 'reg_recent')).toBeTruthy();
  expect(remaining.find((log) => log.registrationId === 'reg_old')).toBeFalsy();
});
