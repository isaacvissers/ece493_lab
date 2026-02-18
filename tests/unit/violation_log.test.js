import { violationLog } from '../../src/services/violation-log.js';

test('logs and clears violation failures', () => {
  violationLog.clear();
  violationLog.logFailure({ errorType: 'evaluation_failed', message: 'failed', context: 'paper_1' });
  const failures = violationLog.getFailures();
  expect(failures).toHaveLength(1);
  expect(failures[0].errorType).toBe('evaluation_failed');
  violationLog.clear();
  expect(violationLog.getFailures()).toHaveLength(0);
});
