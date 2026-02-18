import { reviewerBatchAssign } from '../../src/services/reviewer-batch-assign.js';

test('allows only remaining slots and blocks extras', () => {
  const result = reviewerBatchAssign.split({
    reviewerEmails: ['a@example.com', 'b@example.com', 'c@example.com'],
    currentCount: 2,
    max: 3,
  });
  expect(result.allowed).toHaveLength(1);
  expect(result.blocked).toHaveLength(2);
});
