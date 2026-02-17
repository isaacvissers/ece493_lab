import { reviewerAssignmentCount } from '../../src/services/reviewer-assignment-count.js';
import { assignmentStore } from '../../src/services/assignment-store.js';
import { createAssignment } from '../../src/models/assignment.js';

beforeEach(() => {
  assignmentStore.reset();
});

test('returns active assignment count', () => {
  assignmentStore.addAssignment(createAssignment({ paperId: 'paper_1', reviewerEmail: 'reviewer@example.com' }));
  assignmentStore.addAssignment(createAssignment({ paperId: 'paper_2', reviewerEmail: 'reviewer@example.com' }));
  expect(reviewerAssignmentCount.getActiveCount('reviewer@example.com')).toBe(2);
});
