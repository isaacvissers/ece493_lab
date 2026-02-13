import { submissionErrorLog } from '../../src/services/submission-error-log.js';

test('logs, reads, and clears submission failures', () => {
  submissionErrorLog.clear();
  expect(submissionErrorLog.getFailures()).toEqual([]);
  submissionErrorLog.logFailure({ errorType: 'storage', message: 'fail' });
  const failures = submissionErrorLog.getFailures();
  expect(failures.length).toBe(1);
  expect(failures[0].errorType).toBe('storage');
  submissionErrorLog.clear();
  expect(submissionErrorLog.getFailures()).toEqual([]);
});
