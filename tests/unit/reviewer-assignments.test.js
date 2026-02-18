import { reviewerAssignments } from '../../src/services/reviewer-assignments.js';
import { assignmentStore } from '../../src/services/assignment-store.js';
import { assignmentStorage } from '../../src/services/assignment-storage.js';
import { submissionStorage } from '../../src/services/submission-storage.js';
import { createAssignment } from '../../src/models/assignment.js';
import { createManuscript } from '../../src/models/manuscript.js';

beforeEach(() => {
  assignmentStore.reset();
  assignmentStorage.reset();
  submissionStorage.reset();
});

test('filters to accepted assignments only', () => {
  assignmentStorage.seedPaper({ id: 'paper_1', title: 'Accepted Paper', status: 'available' });
  assignmentStorage.seedPaper({ id: 'paper_2', title: 'Pending Paper', status: 'available' });
  const manuscript = createManuscript({
    title: 'Accepted Paper',
    authorNames: 'A',
    affiliations: 'B',
    contactEmail: 'a@example.com',
    abstract: 'Abstract',
    keywords: 'key',
    mainSource: 'upload',
  }, { originalName: 'paper.pdf' }, 'author@example.com');
  manuscript.id = 'paper_1';
  submissionStorage.saveSubmission(manuscript);

  assignmentStore.addAssignment(createAssignment({
    paperId: 'paper_1',
    reviewerEmail: 'reviewer@example.com',
    status: 'accepted',
  }));
  assignmentStore.addAssignment(createAssignment({
    paperId: 'paper_2',
    reviewerEmail: 'reviewer@example.com',
    status: 'pending',
  }));

  const result = reviewerAssignments.listAcceptedAssignments({ reviewerEmail: 'reviewer@example.com' });
  expect(result.assignments).toHaveLength(1);
  expect(result.assignments[0].paperId).toBe('paper_1');
});

test('returns empty list when none accepted', () => {
  assignmentStore.addAssignment(createAssignment({
    paperId: 'paper_2',
    reviewerEmail: 'reviewer@example.com',
    status: 'pending',
  }));
  const result = reviewerAssignments.listAcceptedAssignments({ reviewerEmail: 'reviewer@example.com' });
  expect(result.assignments).toHaveLength(0);
});
