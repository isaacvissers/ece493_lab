import { assignmentStorage } from '../../src/services/assignment-storage.js';

beforeEach(() => {
  assignmentStorage.reset();
});

test('seeds and retrieves papers', () => {
  assignmentStorage.seedPaper({ id: 'paper_1', title: 'Paper', status: 'Submitted' });
  const paper = assignmentStorage.getPaper('paper_1');
  expect(paper.title).toBe('Paper');
});

test('returns all papers with getPapers', () => {
  assignmentStorage.seedPaper({ id: 'paper_1', title: 'Paper One', status: 'Submitted' });
  assignmentStorage.seedPaper({ id: 'paper_2', title: 'Paper Two', status: 'Submitted' });
  const papers = assignmentStorage.getPapers();
  expect(papers).toHaveLength(2);
});

test('loads papers from localStorage when available', () => {
  assignmentStorage.reset();
  localStorage.setItem('cms.papers', JSON.stringify([
    { id: 'paper_a', title: 'Stored', status: 'Submitted', assignedRefereeEmails: [], assignmentVersion: 0 },
  ]));
  const papers = assignmentStorage.getPapers();
  expect(papers).toHaveLength(1);
  expect(papers[0].id).toBe('paper_a');
});

test('getPaper returns null when missing', () => {
  assignmentStorage.seedPaper({ id: 'paper_3', title: 'Paper Three', status: 'Submitted' });
  expect(assignmentStorage.getPaper('missing')).toBeNull();
});

test('saves assignments atomically', () => {
  assignmentStorage.seedPaper({ id: 'paper_2', title: 'Paper', status: 'Submitted' });
  const updated = assignmentStorage.saveAssignments({
    paperId: 'paper_2',
    refereeEmails: ['a@example.com', 'b@example.com', 'c@example.com'],
    expectedVersion: 0,
  });
  expect(updated.assignedRefereeEmails).toHaveLength(3);
});

test('blocks concurrent changes', () => {
  assignmentStorage.seedPaper({ id: 'paper_3', title: 'Paper', status: 'Submitted' });
  assignmentStorage.saveAssignments({
    paperId: 'paper_3',
    refereeEmails: ['a@example.com', 'b@example.com', 'c@example.com'],
    expectedVersion: 0,
  });
  expect(() => assignmentStorage.saveAssignments({
    paperId: 'paper_3',
    refereeEmails: ['d@example.com', 'e@example.com', 'f@example.com'],
    expectedVersion: 0,
  })).toThrow('concurrent_change');
});

test('rejects ineligible papers', () => {
  assignmentStorage.seedPaper({ id: 'paper_4', title: 'Paper', status: 'Withdrawn' });
  expect(() => assignmentStorage.saveAssignments({
    paperId: 'paper_4',
    refereeEmails: ['a@example.com', 'b@example.com', 'c@example.com'],
    expectedVersion: 0,
  })).toThrow('paper_ineligible');
});

test('throws on missing paper', () => {
  expect(() => assignmentStorage.saveAssignments({
    paperId: 'missing',
    refereeEmails: ['a@example.com', 'b@example.com', 'c@example.com'],
    expectedVersion: 0,
  })).toThrow('paper_not_found');
});

test('throws when failure mode enabled', () => {
  assignmentStorage.seedPaper({ id: 'paper_5', title: 'Paper', status: 'Submitted' });
  assignmentStorage.setFailureMode(true);
  expect(() => assignmentStorage.saveAssignments({
    paperId: 'paper_5',
    refereeEmails: ['a@example.com', 'b@example.com', 'c@example.com'],
    expectedVersion: 0,
  })).toThrow('assignment_storage_failure');
});

test('updatePaperStatus throws when paper is missing', () => {
  expect(() => assignmentStorage.updatePaperStatus({ paperId: 'missing', status: 'in_review' }))
    .toThrow('paper_not_found');
});

test('updatePaperStatus throws on concurrent change', () => {
  assignmentStorage.seedPaper({ id: 'paper_6', title: 'Paper', status: 'Submitted', assignmentVersion: 1 });
  expect(() => assignmentStorage.updatePaperStatus({
    paperId: 'paper_6',
    status: 'in_review',
    expectedVersion: 0,
  })).toThrow('concurrent_change');
});
