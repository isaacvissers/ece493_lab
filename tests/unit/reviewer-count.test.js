import { reviewerCount } from '../../src/services/reviewer-count.js';
import { assignmentStore } from '../../src/services/assignment-store.js';
import { createAssignment } from '../../src/models/assignment.js';

beforeEach(() => {
  assignmentStore.reset();
});

test('counts all reviewer assignments regardless of status', () => {
  assignmentStore.addAssignment(createAssignment({ paperId: 'paper_1', reviewerEmail: 'a@example.com', status: 'pending' }));
  assignmentStore.addAssignment(createAssignment({ paperId: 'paper_1', reviewerEmail: 'b@example.com', status: 'accepted' }));
  assignmentStore.addAssignment(createAssignment({ paperId: 'paper_1', reviewerEmail: 'c@example.com', status: 'declined' }));
  const count = reviewerCount.getCountForPaper({ paperId: 'paper_1' });
  expect(count).toBe(3);
});

test('flags over-assignment when count exceeds three', () => {
  assignmentStore.addAssignment(createAssignment({ paperId: 'paper_1', reviewerEmail: 'a@example.com', status: 'pending' }));
  assignmentStore.addAssignment(createAssignment({ paperId: 'paper_1', reviewerEmail: 'b@example.com', status: 'accepted' }));
  assignmentStore.addAssignment(createAssignment({ paperId: 'paper_1', reviewerEmail: 'c@example.com', status: 'declined' }));
  assignmentStore.addAssignment(createAssignment({ paperId: 'paper_1', reviewerEmail: 'd@example.com', status: 'withdrawn' }));
  const count = reviewerCount.getCountForPaper({ paperId: 'paper_1' });
  expect(count).toBeGreaterThan(3);
});
