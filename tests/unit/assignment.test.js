import { createAssignment, isActiveAssignment, isSameAssignment } from '../../src/models/assignment.js';

test('creates assignment with generated id and timestamp', () => {
  const assignment = createAssignment({ paperId: 'paper_1', reviewerEmail: 'reviewer@example.com' });
  expect(assignment.assignmentId).toMatch(/^asg_/);
  expect(assignment.assignedAt).toBeTruthy();
});

test('creates assignment with defaults when called without args', () => {
  const assignment = createAssignment();
  expect(assignment.assignmentId).toMatch(/^asg_/);
});

test('respects provided assignment id and timestamp', () => {
  const assignment = createAssignment({
    id: 'asg_1',
    paperId: 'paper_1',
    reviewerEmail: 'reviewer@example.com',
    assignedAt: '2026-02-03T10:00:00.000Z',
  });
  expect(assignment.assignmentId).toBe('asg_1');
  expect(assignment.assignedAt).toBe('2026-02-03T10:00:00.000Z');
});

test('detects active assignments', () => {
  expect(isActiveAssignment({ status: 'active' })).toBe(true);
  expect(isActiveAssignment({ status: 'completed' })).toBe(false);
  expect(isActiveAssignment(null)).toBe(false);
});

test('matches assignments by paper and reviewer', () => {
  const assignment = createAssignment({ paperId: 'paper_1', reviewerEmail: 'reviewer@example.com' });
  expect(isSameAssignment(assignment, 'paper_1', 'reviewer@example.com')).toBe(true);
  expect(isSameAssignment(assignment, 'paper_2', 'reviewer@example.com')).toBe(false);
  expect(isSameAssignment(null, 'paper_1', 'reviewer@example.com')).toBe(false);
});
