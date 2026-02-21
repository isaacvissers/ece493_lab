import { registrationService } from '../../src/services/registration_service.js';
import { registrationWindowService } from '../../src/services/registration_window_service.js';
import { paymentService } from '../../src/services/payment_service.js';
import { registrationLogService } from '../../src/services/registration_log_service.js';

beforeEach(() => {
  registrationService.reset();
  registrationWindowService.reset();
  paymentService.reset();
  registrationLogService.reset();
  const startAt = new Date(Date.now() - 1000).toISOString();
  const endAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
  registrationWindowService.setWindow({ startAt, endAt });
});

test('save failures are logged', () => {
  registrationService.setFailureMode(true);
  const result = registrationService.submitRegistration({
    userId: 'user_fail',
    values: {
      name: 'Ada',
      affiliation: 'Lab',
      contactEmail: 'ada@example.com',
      attendanceType: 'virtual',
    },
  });
  expect(result.ok).toBe(false);
  const logs = registrationLogService.getLogs();
  expect(logs).toHaveLength(1);
  expect(logs[0].event).toBe('save_failure');
});
