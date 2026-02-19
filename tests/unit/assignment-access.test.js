import { jest } from '@jest/globals';
import { reviewerPaperAccess } from '../../src/services/reviewer-paper-access.js';
import { assignmentStore } from '../../src/services/assignment-store.js';
import { assignmentStorage } from '../../src/services/assignment-storage.js';
import { submissionStorage } from '../../src/services/submission-storage.js';
import { createAssignment } from '../../src/models/assignment.js';
import { createManuscript } from '../../src/models/manuscript.js';

function seedManuscript(id, title) {
  const manuscript = createManuscript({
    title,
    authorNames: 'A',
    affiliations: 'B',
    contactEmail: 'a@example.com',
    abstract: 'Abstract',
    keywords: 'key',
    mainSource: 'upload',
  }, { originalName: `${id}.pdf` }, 'author@example.com');
  manuscript.id = id;
  submissionStorage.saveSubmission(manuscript);
}

beforeEach(() => {
  assignmentStore.reset();
  assignmentStorage.reset();
  submissionStorage.reset();
});

test('returns not_accepted when no accepted assignment exists', () => {
  assignmentStorage.seedPaper({ id: 'paper_1', title: 'Paper', status: 'available' });
  seedManuscript('paper_1', 'Paper');
  const result = reviewerPaperAccess.getPaperDetails({ reviewerEmail: 'reviewer@example.com', paperId: 'paper_1' });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('not_accepted');
});

test('returns ok when assignment accepted and manuscript available', () => {
  assignmentStorage.seedPaper({ id: 'paper_2', title: 'Paper', status: 'available' });
  seedManuscript('paper_2', 'Paper');
  assignmentStore.addAssignment(createAssignment({
    paperId: 'paper_2',
    reviewerEmail: 'reviewer@example.com',
    status: 'accepted',
  }));
  const result = reviewerPaperAccess.getPaperDetails({ reviewerEmail: 'reviewer@example.com', paperId: 'paper_2' });
  expect(result.ok).toBe(true);
  expect(result.paper.id).toBe('paper_2');
});

test('returns invalid_request when missing identifiers', () => {
  const result = reviewerPaperAccess.getPaperDetails({ reviewerEmail: null, paperId: 'paper_1' });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('invalid_request');
});

test('returns unavailable when paper is withdrawn', () => {
  assignmentStorage.seedPaper({ id: 'paper_3', title: 'Paper', status: 'withdrawn' });
  seedManuscript('paper_3', 'Paper');
  assignmentStore.addAssignment(createAssignment({
    paperId: 'paper_3',
    reviewerEmail: 'reviewer@example.com',
    status: 'accepted',
  }));
  const result = reviewerPaperAccess.getPaperDetails({ reviewerEmail: 'reviewer@example.com', paperId: 'paper_3' });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('unavailable');
});

test('returns unavailable when manuscript file missing', () => {
  assignmentStorage.seedPaper({ id: 'paper_4', title: 'Paper', status: 'available' });
  seedManuscript('paper_4', 'Paper');
  const manuscript = submissionStorage.getManuscripts()[0];
  manuscript.fileStatus = 'missing';
  assignmentStore.addAssignment(createAssignment({
    paperId: 'paper_4',
    reviewerEmail: 'reviewer@example.com',
    status: 'accepted',
  }));
  const result = reviewerPaperAccess.getPaperDetails({ reviewerEmail: 'reviewer@example.com', paperId: 'paper_4' });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('unavailable');
});

test('logs retrieval failures when assignment store throws', () => {
  const errorLog = { logFailure: jest.fn() };
  const failingStore = { getAssignments: () => { throw new Error('boom'); } };
  const result = reviewerPaperAccess.getPaperDetails({
    reviewerEmail: 'reviewer@example.com',
    paperId: 'paper_5',
    assignmentStore: failingStore,
    errorLog,
  });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('retrieval_failed');
  expect(errorLog.logFailure).toHaveBeenCalled();
});

test('handles retrieval failure without errorLog', () => {
  const failingStore = { getAssignments: () => { throw new Error('boom'); } };
  const result = reviewerPaperAccess.getPaperDetails({
    reviewerEmail: 'reviewer@example.com',
    paperId: 'paper_6',
    assignmentStore: failingStore,
    errorLog: null,
  });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('retrieval_failed');
});

test('returns unavailable when manuscript missing', () => {
  assignmentStorage.seedPaper({ id: 'paper_7', title: 'Paper', status: 'available' });
  assignmentStore.addAssignment(createAssignment({
    paperId: 'paper_7',
    reviewerEmail: 'reviewer@example.com',
    status: 'accepted',
  }));
  const result = reviewerPaperAccess.getPaperDetails({ reviewerEmail: 'reviewer@example.com', paperId: 'paper_7' });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('unavailable');
});

test('logs fallback message when error has no message', () => {
  const errorLog = { logFailure: jest.fn() };
  const failingStore = { getAssignments: () => { throw {}; } };
  const result = reviewerPaperAccess.getPaperDetails({
    reviewerEmail: 'reviewer@example.com',
    paperId: 'paper_8',
    assignmentStore: failingStore,
    errorLog,
  });
  expect(result.ok).toBe(false);
  expect(errorLog.logFailure).toHaveBeenCalledWith(
    expect.objectContaining({ message: 'assignment_retrieval_failed' }),
  );
});

test('uses default parameters when called with no args', () => {
  const result = reviewerPaperAccess.getPaperDetails();
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('invalid_request');
});
