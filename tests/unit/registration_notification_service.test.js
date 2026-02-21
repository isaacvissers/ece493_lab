import { notificationService } from '../../src/services/notification_service.js';

beforeEach(() => {
  notificationService.reset();
});

test('registration notifications require registration payload', () => {
  const result = notificationService.sendRegistrationConfirmation();
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('missing_registration');
});

test('registration notifications record failures', () => {
  notificationService.setFailureMode({ email: true, inApp: true });
  const result = notificationService.sendRegistrationConfirmation({
    registration: { id: 'reg_1', userId: 'user_1' },
    channels: ['email', 'in_app'],
  });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('notification_failed');
  const entries = notificationService.getRegistrationNotifications();
  expect(entries).toHaveLength(2);
  expect(entries[0].status).toBe('failed');
});
