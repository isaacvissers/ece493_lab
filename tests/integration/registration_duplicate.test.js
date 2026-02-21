import { registrationService } from '../../src/services/registration_service.js';
import { registrationWindowService } from '../../src/services/registration_window_service.js';
import { paymentService } from '../../src/services/payment_service.js';

beforeEach(() => {
  registrationService.reset();
  registrationWindowService.reset();
  paymentService.reset();
  const startAt = new Date(Date.now() - 1000).toISOString();
  const endAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
  registrationWindowService.setWindow({ startAt, endAt });
  paymentService.setRegistrationFee(0);
});

test('duplicate registrations are blocked', () => {
  const first = registrationService.submitRegistration({
    userId: 'user_dup',
    values: {
      name: 'Ada',
      affiliation: 'Lab',
      contactEmail: 'ada@example.com',
      attendanceType: 'virtual',
    },
  });
  expect(first.ok).toBe(true);
  const second = registrationService.submitRegistration({
    userId: 'user_dup',
    values: {
      name: 'Ada',
      affiliation: 'Lab',
      contactEmail: 'ada@example.com',
      attendanceType: 'virtual',
    },
  });
  expect(second.ok).toBe(false);
  expect(second.reason).toBe('duplicate');
  expect(second.registration.id).toBe(first.registration.id);
});
