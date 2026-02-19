import { refereeReadiness } from '../../src/services/referee-readiness.js';

test('refereeReadiness evaluate executes buildResult defaults', () => {
  const result = refereeReadiness.evaluate({
    paperId: 'paper_cov',
    refereeCount: { getCount: () => { throw new Error('fail'); } },
    readinessAudit: null,
    errorLog: null,
  });

  expect(result.ok).toBe(false);
  expect(result.missingInvitations).toEqual([]);
});

test('refereeReadiness evaluate builds result for blocked path', () => {
  const result = refereeReadiness.evaluate({
    paperId: 'paper_block',
    refereeCount: { getCount: () => 5 },
    readinessAudit: null,
    errorLog: null,
  });
  expect(result.ok).toBe(true);
  expect(result.ready).toBe(false);
});
