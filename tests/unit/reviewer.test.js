import { createReviewer, getActiveAssignmentCount, normalizeReviewerEmail } from '../../src/models/reviewer.js';

test('normalizes reviewer email', () => {
  expect(normalizeReviewerEmail(' Reviewer@Example.COM ')).toBe('reviewer@example.com');
  expect(normalizeReviewerEmail(null)).toBe('');
});

test('counts active assignments', () => {
  const assignments = [
    { status: 'active' },
    { status: 'completed' },
    { status: 'accepted' },
    { status: 'active' },
  ];
  expect(getActiveAssignmentCount(assignments)).toBe(3);
  expect(getActiveAssignmentCount(null)).toBe(0);
});

test('creates reviewer with generated id and count', () => {
  const reviewer = createReviewer({ email: 'reviewer@example.com', assignments: [{ status: 'active' }] });
  expect(reviewer.reviewerId).toMatch(/^rev_/);
  expect(reviewer.email).toBe('reviewer@example.com');
  expect(reviewer.activeAssignmentCount).toBe(1);
});

test('creates reviewer with provided id and ignores invalid assignments', () => {
  const reviewer = createReviewer({ id: 'rev_1', email: 'user@example.com', assignments: 'none' });
  expect(reviewer.reviewerId).toBe('rev_1');
  expect(reviewer.activeAssignmentCount).toBe(0);
});

test('creates reviewer with defaults', () => {
  const reviewer = createReviewer();
  expect(reviewer.reviewerId).toMatch(/^rev_/);
  expect(reviewer.email).toBe('');
  expect(getActiveAssignmentCount()).toBe(0);
});
