import { createReviewerAssignment, isAcceptedReviewerAssignment } from '../../src/models/reviewer-assignment.js';
import { REVIEWER_ASSIGNMENT_STATUS } from '../../src/models/reviewer-assignment-status.js';

test('creates reviewer assignment with normalized email and generated id', () => {
  const assignment = createReviewerAssignment({
    paperId: 'paper_1',
    reviewerEmail: 'Reviewer@Example.com',
  });
  expect(assignment.assignmentId).toMatch(/^rassign_/);
  expect(assignment.reviewerEmail).toBe('reviewer@example.com');
  expect(assignment.status).toBe(REVIEWER_ASSIGNMENT_STATUS.pending);
});

test('accepted reviewer assignment detection handles null and statuses', () => {
  expect(isAcceptedReviewerAssignment(null)).toBe(false);
  expect(isAcceptedReviewerAssignment({ status: REVIEWER_ASSIGNMENT_STATUS.pending })).toBe(false);
  expect(isAcceptedReviewerAssignment({ status: REVIEWER_ASSIGNMENT_STATUS.accepted })).toBe(true);
  expect(isAcceptedReviewerAssignment({ status: REVIEWER_ASSIGNMENT_STATUS.active })).toBe(true);
});

test('respects provided assignment id', () => {
  const assignment = createReviewerAssignment({
    assignmentId: 'assign_123',
    paperId: 'paper_2',
    reviewerEmail: 'reviewer@example.com',
  });
  expect(assignment.assignmentId).toBe('assign_123');
});

test('creates default assignment when called without args', () => {
  const assignment = createReviewerAssignment();
  expect(assignment.assignmentId).toMatch(/^rassign_/);
  expect(assignment.reviewerEmail).toBe('');
});
