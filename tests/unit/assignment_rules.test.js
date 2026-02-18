import { assignmentRules } from '../../src/services/assignment-rules.js';

function createStore({ assigned = false, count = 0, throwOn = null } = {}) {
  return {
    hasActiveAssignment: () => {
      if (throwOn === 'has') {
        throw new Error('lookup_failure');
      }
      return assigned;
    },
    getActiveCountForReviewer: () => {
      if (throwOn === 'count') {
        throw new Error('lookup_failure');
      }
      return count;
    },
  };
}

test('flags invalid email violations', () => {
  const result = assignmentRules.evaluate({
    paperId: 'paper_1',
    reviewerEmails: ['invalid-email'],
    assignmentStore: createStore(),
  });
  expect(result.candidates).toHaveLength(0);
  expect(result.violations[0].rule).toBe('invalid_email');
});

test('flags duplicate entries', () => {
  const result = assignmentRules.evaluate({
    paperId: 'paper_1',
    reviewerEmails: ['dup@example.com', 'dup@example.com'],
    assignmentStore: createStore(),
  });
  expect(result.candidates).toHaveLength(1);
  expect(result.violations[0].rule).toBe('duplicate_entry');
});

test('flags duplicate assignment', () => {
  const result = assignmentRules.evaluate({
    paperId: 'paper_1',
    reviewerEmails: ['a@example.com'],
    assignmentStore: createStore({ assigned: true, count: 0 }),
  });
  expect(result.candidates).toHaveLength(0);
  expect(result.violations[0].rule).toBe('duplicate_assignment');
});

test('flags limit reached', () => {
  const result = assignmentRules.evaluate({
    paperId: 'paper_1',
    reviewerEmails: ['a@example.com'],
    assignmentStore: createStore({ assigned: false, count: 5 }),
  });
  expect(result.candidates).toHaveLength(0);
  expect(result.violations[0].rule).toBe('limit_reached');
});

test('throws evaluation failure on store errors', () => {
  expect(() => assignmentRules.evaluate({
    paperId: 'paper_1',
    reviewerEmails: ['a@example.com'],
    assignmentStore: createStore({ throwOn: 'has' }),
  })).toThrow('evaluation_failed');
});

test('evaluate handles missing args', () => {
  const result = assignmentRules.evaluate();
  expect(result.candidates).toHaveLength(0);
  expect(result.violations).toHaveLength(0);
});

test('throws evaluation failure on invalid counts', () => {
  expect(() => assignmentRules.evaluate({
    paperId: 'paper_1',
    reviewerEmails: ['a@example.com'],
    assignmentStore: createStore({ assigned: false, count: Number.NaN }),
  })).toThrow('evaluation_failed');
});

test('ignores blank entries', () => {
  const result = assignmentRules.evaluate({
    paperId: 'paper_1',
    reviewerEmails: [' ', 'a@example.com'],
    assignmentStore: createStore(),
  });
  expect(result.candidates).toEqual(['a@example.com']);
});
