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
