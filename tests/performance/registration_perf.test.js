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

test('registration completes within 200 ms for typical submission', () => {
  const start = Date.now();
  const result = registrationService.submitRegistration({
    userId: 'user_perf',
    values: {
      name: 'Performance User',
      affiliation: 'Lab',
      contactEmail: 'perf@example.com',
      attendanceType: 'virtual',
    },
  });
  const elapsed = Date.now() - start;
  expect(result.ok).toBe(true);
  expect(elapsed).toBeLessThan(200);
});
