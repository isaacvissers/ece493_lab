import { jest } from '@jest/globals';
import { refereeReadiness } from '../../src/services/referee-readiness.js';

function createCountService() {
  return {
    getCount: () => {
      throw new Error('lookup_failure');
    },
  };
}

test('fails safely and logs when count lookup fails', () => {
  const errorLog = { logFailure: jest.fn() };
  const readinessAudit = { record: jest.fn() };
  const result = refereeReadiness.evaluate({
    paperId: 'paper_1',
    refereeCount: createCountService(),
    errorLog,
    readinessAudit,
  });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('count_failure');
  expect(errorLog.logFailure).toHaveBeenCalled();
  expect(readinessAudit.record).toHaveBeenCalled();
});
