import {
  createRefereeAssignment,
  isNonDeclinedRefereeAssignment,
  normalizeRefereeEmail,
  validateRefereeEmails,
} from '../../src/models/referee-assignment.js';
import { REFEREE_ASSIGNMENT_STATUS } from '../../src/models/referee-assignment-status.js';

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

test('creates referee assignment with defaults', () => {
  const assignment = createRefereeAssignment({ paperId: 'paper_1', refereeEmail: 'Ref@Email.com' });
  expect(assignment.assignmentId).toMatch(/^ref_/);
  expect(assignment.refereeEmail).toBe('ref@email.com');
  expect(assignment.createdAt).toBe(assignment.updatedAt);
  expect(assignment.status).toBe(REFEREE_ASSIGNMENT_STATUS.pending);
});

test('checks non-declined referee assignments', () => {
  expect(isNonDeclinedRefereeAssignment(null)).toBe(false);
  expect(isNonDeclinedRefereeAssignment({ status: REFEREE_ASSIGNMENT_STATUS.pending })).toBe(true);
  expect(isNonDeclinedRefereeAssignment({ status: REFEREE_ASSIGNMENT_STATUS.declined })).toBe(false);
});

test('creates referee assignment with provided timestamps', () => {
  const assignment = createRefereeAssignment({
    assignmentId: 'ref_custom',
    paperId: 'paper_2',
    refereeEmail: 'user@example.com',
    status: REFEREE_ASSIGNMENT_STATUS.accepted,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
  });
  expect(assignment.assignmentId).toBe('ref_custom');
  expect(assignment.createdAt).toBe('2024-01-01T00:00:00.000Z');
  expect(assignment.updatedAt).toBe('2024-01-02T00:00:00.000Z');
});

test('creates referee assignment with empty input', () => {
  const assignment = createRefereeAssignment();
  expect(assignment.assignmentId).toMatch(/^ref_/);
  expect(assignment.refereeEmail).toBe('');
});
