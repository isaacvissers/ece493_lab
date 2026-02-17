import { assignmentErrorLog } from '../../src/services/assignment-error-log.js';

test('logs and clears assignment errors', () => {
  assignmentErrorLog.clear();
  assignmentErrorLog.logFailure({ errorType: 'save', message: 'failed', context: 'paper_1' });
  const failures = assignmentErrorLog.getFailures();
  expect(failures).toHaveLength(1);
  expect(failures[0].errorType).toBe('save');
  assignmentErrorLog.clear();
  expect(assignmentErrorLog.getFailures()).toHaveLength(0);
});
