import { registrationService } from '../../src/services/registration_service.js';
import { registrationWindowService } from '../../src/services/registration_window_service.js';
import { paymentService } from '../../src/services/payment_service.js';
import { notificationService } from '../../src/services/notification_service.js';

beforeEach(() => {
  registrationService.reset();
  registrationWindowService.reset();
  paymentService.reset();
  notificationService.reset();
  const startAt = new Date(Date.now() - 1000).toISOString();
  const endAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
  registrationWindowService.setWindow({ startAt, endAt });
  paymentService.setRegistrationFee(0);
});

test('registration submit stores registration and notifications', () => {
  const result = registrationService.submitRegistration({
    userId: 'user_int',
    values: {
      name: 'Ada',
      affiliation: 'Lab',
      contactEmail: 'ada@example.com',
      attendanceType: 'virtual',
    },
  });
  expect(result.ok).toBe(true);
  const stored = registrationService.getRegistrationForUser('user_int');
  expect(stored.status).toBe('Registered');
  expect(notificationService.getRegistrationNotifications()).toHaveLength(2);
});
