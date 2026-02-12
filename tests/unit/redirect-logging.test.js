import { redirectLogging } from '../../src/services/redirect-logging.js';

test('logs, reads, and clears redirect failures', () => {
  redirectLogging.clear();
  expect(redirectLogging.getFailures()).toEqual([]);
  redirectLogging.logFailure({ reason: 'redirect_failed', error: 'boom' });
  const failures = redirectLogging.getFailures();
  expect(failures.length).toBe(1);
  expect(failures[0].reason).toBe('redirect_failed');
  expect(failures[0].error).toBe('boom');
  expect(failures[0].timestamp).toBeTruthy();
  redirectLogging.clear();
  expect(redirectLogging.getFailures()).toEqual([]);
});
