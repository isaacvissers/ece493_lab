import { normalizeRefereeEmail, validateRefereeEmails } from '../../src/models/referee-assignment.js';

test('normalizes referee emails for uniqueness checks', () => {
  expect(normalizeRefereeEmail(' Ref@Email.COM ')).toBe('ref@email.com');
});

test('normalizes missing referee emails to empty string', () => {
  expect(normalizeRefereeEmail(null)).toBe('');
});

test('validates three unique emails', () => {
  const result = validateRefereeEmails(['a@example.com', 'b@example.com', 'c@example.com']);
  expect(result.ok).toBe(true);
  expect(result.uniqueEmails).toHaveLength(3);
});

test('flags blank emails', () => {
  const result = validateRefereeEmails(['', 'b@example.com', 'c@example.com']);
  expect(result.ok).toBe(false);
  expect(result.blanks).toEqual([0]);
});

test('flags invalid email format', () => {
  const result = validateRefereeEmails(['invalid', 'b@example.com', 'c@example.com']);
  expect(result.ok).toBe(false);
  expect(result.invalid).toEqual([0]);
});

test('flags duplicates case-insensitively', () => {
  const result = validateRefereeEmails(['Ref@Email.com', 'ref@email.com', 'c@example.com']);
  expect(result.ok).toBe(false);
  expect(result.duplicates).toEqual([1]);
});

test('treats already assigned referees as duplicates', () => {
  const result = validateRefereeEmails(
    ['a@example.com', 'b@example.com', 'c@example.com'],
    ['b@example.com'],
  );
  expect(result.ok).toBe(false);
  expect(result.duplicates).toEqual([1]);
});
