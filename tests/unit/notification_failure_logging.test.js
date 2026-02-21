import { registrationLogService } from '../../src/services/registration_log_service.js';

beforeEach(() => {
  registrationLogService.reset();
});

test('logs notification failures for registrations', () => {
  registrationLogService.logNotificationFailure({ registrationId: 'reg_1', message: 'email_failed' });
  const logs = registrationLogService.getLogs();
  expect(logs).toHaveLength(1);
  expect(logs[0].event).toBe('notification_failure');
  expect(logs[0].message).toBe('email_failed');
});
