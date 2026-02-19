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

function seedManuscriptWithoutName(id, title) {
  const manuscript = createManuscript({
    title,
    authorNames: 'A',
    affiliations: 'B',
    contactEmail: 'a@example.com',
    abstract: 'Abstract',
    keywords: 'key',
    mainSource: 'upload',
  }, {}, 'author@example.com');
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

test('returns invalid_request when required identifiers are missing', () => {
  const result = reviewerPaperAccess.getPaperDetails({ reviewerEmail: null, paperId: 'paper_1' });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('invalid_request');
});

test('returns invalid_request when called without args', () => {
  const result = reviewerPaperAccess.getPaperDetails();
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('invalid_request');
});

test('returns unavailable when manuscript is missing', () => {
  assignmentStorage.seedPaper({ id: 'paper_3', title: 'Paper', status: 'available' });
  assignmentStore.addAssignment(createAssignment({
    paperId: 'paper_3',
    reviewerEmail: 'reviewer@example.com',
    status: 'accepted',
  }));
  const result = reviewerPaperAccess.getPaperDetails({ reviewerEmail: 'reviewer@example.com', paperId: 'paper_3' });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('unavailable');
});

test('returns ok with manuscript link fallback when originalName is missing', () => {
  assignmentStorage.seedPaper({ id: 'paper_5', title: 'Paper', status: 'available' });
  seedManuscriptWithoutName('paper_5', 'Paper');
  assignmentStore.addAssignment(createAssignment({
    paperId: 'paper_5',
    reviewerEmail: 'reviewer@example.com',
    status: 'accepted',
  }));

  const result = reviewerPaperAccess.getPaperDetails({ reviewerEmail: 'reviewer@example.com', paperId: 'paper_5' });
  expect(result.ok).toBe(true);
  expect(result.manuscriptLink).toBeUndefined();
});

test('logs fallback message when assignment retrieval error lacks detail', () => {
  const errorLog = { logFailure: jest.fn() };
  const result = reviewerPaperAccess.getPaperDetails({
    reviewerEmail: 'reviewer@example.com',
    paperId: 'paper_4',
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
