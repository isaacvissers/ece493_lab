import { createViolation } from '../../src/models/violation.js';

test('creates violation with generated id', () => {
  const violation = createViolation({ reviewerEmail: 'a@example.com', rule: 'invalid_email', message: 'Invalid' });
  expect(violation.violationId).toMatch(/^vio_/);
});

test('uses provided violation id', () => {
  const violation = createViolation({ id: 'vio_1', reviewerEmail: 'a@example.com', rule: 'invalid_email', message: 'Invalid' });
  expect(violation.violationId).toBe('vio_1');
});

test('handles defaults when called without args', () => {
  const violation = createViolation();
  expect(violation.violationId).toMatch(/^vio_/);
  expect(violation.reviewerEmail).toBe('');
});
