import { loginLogging } from '../../src/services/login-logging.js';

test('logs, reads, and clears failures', () => {
  loginLogging.clear();
  expect(loginLogging.getFailures()).toEqual([]);
  loginLogging.logFailure({ identifier: 'user@example.com', error: 'lookup_failed', failureType: 'lookup_failure' });
  const failures = loginLogging.getFailures();
  expect(failures.length).toBe(1);
  expect(failures[0].identifier).toBe('user@example.com');
  expect(failures[0].error).toBe('lookup_failed');
  expect(failures[0].failureType).toBe('lookup_failure');
  expect(failures[0].timestamp).toBeTruthy();
  loginLogging.clear();
  expect(loginLogging.getFailures()).toEqual([]);
});
