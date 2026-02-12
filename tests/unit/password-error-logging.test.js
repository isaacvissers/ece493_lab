import { passwordErrorLogging } from '../../src/services/password-error-logging.js';

test('logs, reads, and clears password failures', () => {
  passwordErrorLogging.clear();
  expect(passwordErrorLogging.getFailures()).toEqual([]);
  passwordErrorLogging.logFailure({ userId: 'acct_1', error: 'update_failed' });
  const failures = passwordErrorLogging.getFailures();
  expect(failures.length).toBe(1);
  expect(failures[0].userId).toBe('acct_1');
  passwordErrorLogging.clear();
  expect(passwordErrorLogging.getFailures()).toEqual([]);
});
