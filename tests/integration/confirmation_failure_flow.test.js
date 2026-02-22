import { registrationService } from '../../src/services/registration_service.js';
import { registrationWindowService } from '../../src/services/registration_window_service.js';
import { paymentService } from '../../src/services/payment_service.js';
import { paymentStorageService } from '../../src/services/payment_storage_service.js';
import { confirmationStorageService } from '../../src/services/confirmation_storage_service.js';
import { confirmationGeneratorService } from '../../src/services/confirmation_generator_service.js';
import { confirmationNotificationService } from '../../src/services/confirmation_notification_service.js';

beforeEach(() => {
  registrationService.reset();
  registrationWindowService.setWindow({
    startAt: new Date(Date.now() - 1000 * 60).toISOString(),
    endAt: new Date(Date.now() + 1000 * 60).toISOString(),
  });
  paymentService.reset();
  paymentStorageService.reset();
  confirmationStorageService.reset();
  confirmationGeneratorService.reset();
  confirmationNotificationService.reset();
});

test('pending confirmations retry on next access', () => {
  const registrationResult = registrationService.submitRegistration({
    userId: 'acct_attendee',
    values: {
      name: 'Ada Lovelace',
      affiliation: 'Computing',
      contactEmail: 'ada@example.com',
      attendanceType: 'virtual',
    },
    paymentService,
  });

  confirmationGeneratorService.setFailureMode(true);
  const first = confirmationGeneratorService.generateConfirmation({
    registrationId: registrationResult.registration.id,
  });
  expect(first.ok).toBe(false);
  expect(first.reason).toBe('pending');

  confirmationGeneratorService.setFailureMode(false);
  const second = confirmationGeneratorService.generateConfirmation({
    registrationId: registrationResult.registration.id,
  });
  expect(second.ok).toBe(true);
});

test('storage failure preserves payment while reporting error', () => {
  const registrationResult = registrationService.submitRegistration({
    userId: 'acct_attendee',
    values: {
      name: 'Ada Lovelace',
      affiliation: 'Computing',
      contactEmail: 'ada@example.com',
      attendanceType: 'virtual',
    },
    paymentService,
  });
  confirmationStorageService.setFailureMode(true);
  const result = confirmationGeneratorService.generateConfirmation({
    registrationId: registrationResult.registration.id,
  });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('storage_failed');
});

test('notification failure does not block confirmation storage', () => {
  const registrationResult = registrationService.submitRegistration({
    userId: 'acct_attendee',
    values: {
      name: 'Ada Lovelace',
      affiliation: 'Computing',
      contactEmail: 'ada@example.com',
      attendanceType: 'virtual',
    },
    paymentService,
  });
  confirmationNotificationService.setFailureMode({ email: true });
  const result = confirmationGeneratorService.generateConfirmation({
    registrationId: registrationResult.registration.id,
  });
  expect(result.ok).toBe(true);
  expect(result.notification.ok).toBe(false);
});
