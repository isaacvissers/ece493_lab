import { jest } from '@jest/globals';
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

test('returns ok with empty list when reviewer email missing', () => {
  assignmentStore.addAssignment(createAssignment({
    paperId: 'paper_3',
    reviewerEmail: 'reviewer@example.com',
    status: 'accepted',
  }));
  const result = reviewerAssignments.listAcceptedAssignments({ reviewerEmail: null });
  expect(result.ok).toBe(true);
  expect(result.assignments).toHaveLength(0);
});

test('uses manuscript title when paper is missing', () => {
  const manuscript = createManuscript({
    title: 'Manuscript Title',
    authorNames: 'A',
    affiliations: 'B',
    contactEmail: 'a@example.com',
    abstract: 'Abstract',
    keywords: 'key',
    mainSource: 'upload',
  }, { originalName: 'paper.pdf' }, 'author@example.com');
  manuscript.id = 'paper_4';
  submissionStorage.saveSubmission(manuscript);
  assignmentStore.addAssignment(createAssignment({
    paperId: 'paper_4',
    reviewerEmail: 'reviewer@example.com',
    status: 'accepted',
  }));

  const result = reviewerAssignments.listAcceptedAssignments({ reviewerEmail: 'reviewer@example.com' });
  expect(result.assignments[0].title).toBe('Manuscript Title');
});

test('falls back to unavailable title when paper and manuscript missing', () => {
  assignmentStore.addAssignment(createAssignment({
    paperId: 'paper_5',
    reviewerEmail: 'reviewer@example.com',
    status: 'accepted',
  }));

  const result = reviewerAssignments.listAcceptedAssignments({ reviewerEmail: 'reviewer@example.com' });
  expect(result.assignments[0].title).toBe('Unavailable paper');
});

test('returns retrieval_failed when assignment store throws and logs failure', () => {
  const errorLog = { logFailure: jest.fn() };
  const failingStore = { getAssignments: () => { throw new Error('boom'); } };
  const result = reviewerAssignments.listAcceptedAssignments({
    reviewerEmail: 'reviewer@example.com',
    assignmentStore: failingStore,
    errorLog,
  });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('retrieval_failed');
  expect(errorLog.logFailure).toHaveBeenCalled();
});

test('returns retrieval_failed without logging when errorLog missing', () => {
  const failingStore = { getAssignments: () => { throw new Error('boom'); } };
  const result = reviewerAssignments.listAcceptedAssignments({
    reviewerEmail: 'reviewer@example.com',
    assignmentStore: failingStore,
    errorLog: null,
  });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('retrieval_failed');
});

test('uses default parameters when called with no args', () => {
  const result = reviewerAssignments.listAcceptedAssignments();
  expect(result.ok).toBe(true);
  expect(result.assignments).toEqual([]);
});

test('logs fallback message when error has no message', () => {
  const errorLog = { logFailure: jest.fn() };
  const failingStore = { getAssignments: () => { throw {}; } };
  const result = reviewerAssignments.listAcceptedAssignments({
    reviewerEmail: 'reviewer@example.com',
    assignmentStore: failingStore,
    errorLog,
  });
  expect(result.ok).toBe(false);
  expect(errorLog.logFailure).toHaveBeenCalledWith(
    expect.objectContaining({ message: 'assignment_retrieval_failed' }),
  );
});
