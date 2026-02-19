import { jest } from '@jest/globals';
import { reviewerAssignments } from '../../src/services/reviewer-assignments.js';
import { reviewerPaperAccess } from '../../src/services/reviewer-paper-access.js';
import { assignmentStore } from '../../src/services/assignment-store.js';

beforeEach(() => {
  assignmentStore.reset();
});

test('reviewerAssignments logs retrieval failures', () => {
  const errorLog = { logFailure: jest.fn() };
  assignmentStore.setLookupFailureMode(true);
  const result = reviewerAssignments.listAcceptedAssignments({
    reviewerEmail: 'reviewer@example.com',
    errorLog,
  });
  expect(result.ok).toBe(false);
  expect(errorLog.logFailure).toHaveBeenCalled();
});

test('reviewerPaperAccess returns retrieval_failed when store fails', () => {
  const errorLog = { logFailure: jest.fn() };
  assignmentStore.setLookupFailureMode(true);
  const result = reviewerPaperAccess.getPaperDetails({
    reviewerEmail: 'reviewer@example.com',
    paperId: 'paper_1',
    errorLog,
  });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('retrieval_failed');
});

test('reviewerAssignments returns empty list when reviewer email missing', () => {
  const result = reviewerAssignments.listAcceptedAssignments();
  expect(result.ok).toBe(true);
  expect(result.assignments).toEqual([]);
});

test('reviewerAssignments logs fallback message when retrieval error lacks detail', () => {
  const errorLog = { logFailure: jest.fn() };
  const result = reviewerAssignments.listAcceptedAssignments({
    reviewerEmail: 'reviewer@example.com',
    assignmentStore: { getAssignments: () => { throw {}; } },
    assignmentStorage: { getPaper: () => null },
    submissionStorage: { getManuscripts: () => [] },
    errorLog,
  });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('retrieval_failed');
  expect(errorLog.logFailure).toHaveBeenCalledWith(expect.objectContaining({
    message: 'assignment_retrieval_failed',
  }));
});
