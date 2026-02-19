import { jest } from '@jest/globals';
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
  const errorLog = { logFailure: jest.fn() };
  const readinessAudit = { record: jest.fn() };
  const result = refereeReadiness.evaluate({
    paperId: 'paper_1',
    refereeCount: createCountService({ throwOn: true }),
    errorLog,
    readinessAudit,
  });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('count_failure');
  expect(errorLog.logFailure).toHaveBeenCalled();
  expect(readinessAudit.record).toHaveBeenCalledWith(expect.objectContaining({ result: 'error' }));
});

test('returns missing invitations when count is three', () => {
  const readinessAudit = { record: jest.fn() };
  const result = refereeReadiness.evaluate({
    paperId: 'paper_2',
    refereeCount: createCountService({ count: 3 }),
    invitationCheck: createInvitationCheck({ missing: ['a@example.com'] }),
    readinessAudit,
  });
  expect(result.missingInvitations).toEqual(['a@example.com']);
  expect(readinessAudit.record).toHaveBeenCalledWith(expect.objectContaining({ result: 'ready', count: 3 }));
});

test('skips invitation check when disabled', () => {
  const result = refereeReadiness.evaluate({
    paperId: 'paper_3',
    refereeCount: createCountService({ count: 3 }),
    invitationCheck: null,
  });
  expect(result.missingInvitations).toEqual([]);
});

test('records blocked readiness audits', () => {
  const readinessAudit = { record: jest.fn() };
  refereeReadiness.evaluate({
    paperId: 'paper_4',
    refereeCount: createCountService({ count: 4 }),
    readinessAudit,
  });
  expect(readinessAudit.record).toHaveBeenCalledWith(expect.objectContaining({ result: 'blocked', reason: 'count_high' }));
});

test('handles count failures without loggers', () => {
  const result = refereeReadiness.evaluate({
    paperId: 'paper_5',
    refereeCount: createCountService({ throwOn: true }),
    errorLog: null,
    readinessAudit: null,
  });
  expect(result.ok).toBe(false);
});

test('skips audit when readinessAudit is missing', () => {
  const result = refereeReadiness.evaluate({
    paperId: 'paper_6',
    refereeCount: createCountService({ count: 2 }),
    readinessAudit: null,
  });
  expect(result.ready).toBe(false);
});

test('logs fallback count failure message when error lacks message', () => {
  const errorLog = { logFailure: jest.fn() };
  const refereeCount = { getCount: () => { throw {}; } };
  const result = refereeReadiness.evaluate({
    paperId: 'paper_7',
    refereeCount,
    errorLog,
    readinessAudit: null,
  });
  expect(result.ok).toBe(false);
  expect(errorLog.logFailure).toHaveBeenCalledWith(expect.objectContaining({ message: 'count_failure' }));
});

test('handles readiness evaluation with default args', () => {
  const result = refereeReadiness.evaluate();
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('count_failure');
});

test('skips readiness audit when ready and audit is missing', () => {
  const result = refereeReadiness.evaluate({
    paperId: 'paper_8',
    refereeCount: createCountService({ count: 3 }),
    invitationCheck: null,
    readinessAudit: null,
  });
  expect(result.ready).toBe(true);
});
