import { jest } from '@jest/globals';
import { overassignmentCheck } from '../../src/services/overassignment-check.js';

function createReviewerCount() {
  return {
    getCountForPaper: () => {
      throw new Error('lookup_failure');
    },
  };
}

test('overassignmentCheck fails safely and logs on count failure', () => {
  const errorLog = { logFailure: jest.fn() };
  const result = overassignmentCheck.evaluate({
    paperId: 'paper_1',
    reviewerCount: createReviewerCount(),
    errorLog,
  });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('count_failure');
  expect(errorLog.logFailure).toHaveBeenCalled();
});
