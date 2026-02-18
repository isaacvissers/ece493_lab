import { assignmentRules } from '../../src/services/assignment-rules.js';

const sampleViolations = [
  { reviewerEmail: 'a@example.com', rule: 'invalid_email', message: 'Invalid' },
  { reviewerEmail: 'a@example.com', rule: 'limit_reached', message: 'Limit' },
  { reviewerEmail: 'b@example.com', rule: 'duplicate_entry', message: 'Duplicate' },
];

test('aggregates violations by email', () => {
  const summary = assignmentRules.aggregate(sampleViolations);
  const a = summary.find((entry) => entry.email === 'a@example.com');
  const b = summary.find((entry) => entry.email === 'b@example.com');
  expect(a.entries).toHaveLength(2);
  expect(b.entries).toHaveLength(1);
});

test('ignores falsy violation entries', () => {
  const summary = assignmentRules.aggregate([null, undefined, ...sampleViolations]);
  expect(summary).toHaveLength(2);
});

test('uses unknown key when reviewerEmail missing', () => {
  const summary = assignmentRules.aggregate([{ rule: 'invalid_email', message: 'Invalid' }]);
  expect(summary[0].email).toBe('unknown');
});

test('aggregate handles missing args', () => {
  const summary = assignmentRules.aggregate();
  expect(summary).toHaveLength(0);
});
