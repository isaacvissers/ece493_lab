import { refereeReadiness } from '../../src/services/referee-readiness.js';

function createCountService({ count = 3, throwOn = false } = {}) {
  return {
    getCount: () => {
      if (throwOn) {
        throw new Error('lookup_failure');
      }
      return count;
    },
  };
}

function createInvitationCheck({ missing = [] } = {}) {
  return {
    getMissingInvitations: () => missing.slice(),
  };
}

test('allows readiness when count is exactly three', () => {
  const result = refereeReadiness.evaluate({
    paperId: 'paper_1',
    refereeCount: createCountService({ count: 3 }),
    invitationCheck: createInvitationCheck({ missing: [] }),
  });
  expect(result.ok).toBe(true);
  expect(result.ready).toBe(true);
  expect(result.count).toBe(3);
});

test('blocks readiness when count is fewer than three', () => {
  const result = refereeReadiness.evaluate({
    paperId: 'paper_1',
    refereeCount: createCountService({ count: 2 }),
  });
  expect(result.ok).toBe(true);
  expect(result.ready).toBe(false);
  expect(result.reason).toBe('count_low');
});

test('blocks readiness when count is greater than three', () => {
  const result = refereeReadiness.evaluate({
    paperId: 'paper_1',
    refereeCount: createCountService({ count: 4 }),
  });
  expect(result.ok).toBe(true);
  expect(result.ready).toBe(false);
  expect(result.reason).toBe('count_high');
});

test('fails safely when count lookup fails', () => {
  const result = refereeReadiness.evaluate({
    paperId: 'paper_1',
    refereeCount: createCountService({ throwOn: true }),
  });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('count_failure');
});
