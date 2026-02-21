import { registrationService } from '../../src/services/registration_service.js';
import { registrationWindowService } from '../../src/services/registration_window_service.js';
import { paymentService } from '../../src/services/payment_service.js';

beforeEach(() => {
  registrationService.reset();
  registrationWindowService.reset();
  paymentService.reset();
});

test('returns closed when registration window is closed', () => {
  const startAt = '2026-01-01T00:00:00.000Z';
  const endAt = '2026-01-05T00:00:00.000Z';
  registrationWindowService.setWindow({ startAt, endAt });
  const result = registrationService.submitRegistration({
    userId: 'user_closed',
    values: {
      name: 'Ada',
      affiliation: 'Lab',
      contactEmail: 'ada@example.com',
      attendanceType: 'virtual',
    },
  });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('closed');
  expect(result.window.startAt).toBe(startAt);
});
