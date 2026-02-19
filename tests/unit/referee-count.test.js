import { refereeCount } from '../../src/services/referee-count.js';

function createAssignmentStorage(paper) {
  return {
    getPaper: () => paper,
  };
}

function createReviewRequestStore(requests) {
  return {
    getRequests: () => requests,
  };
}

test('getNonDeclinedEmails throws when paper is missing', () => {
  const assignmentStorage = createAssignmentStorage(null);
  expect(() => refereeCount.getNonDeclinedEmails({ paperId: 'missing', assignmentStorage, reviewRequestStore: createReviewRequestStore([]) }))
    .toThrow('paper_not_found');
});

test('getNonDeclinedEmails merges assigned and pending invitations', () => {
  const assignmentStorage = createAssignmentStorage({
    id: 'paper_1',
    assignedRefereeEmails: ['A@example.com', 'b@example.com', ''],
  });
  const reviewRequestStore = createReviewRequestStore([
    { paperId: 'paper_1', reviewerEmail: 'c@example.com', status: 'sent' },
    { paperId: 'paper_1', reviewerEmail: 'd@example.com', status: 'failed' },
    { paperId: 'paper_1', reviewerEmail: 'b@example.com', status: 'sent', decision: 'accept' },
    { paperId: 'paper_2', reviewerEmail: 'x@example.com', status: 'sent' },
  ]);

  const emails = refereeCount.getNonDeclinedEmails({ paperId: 'paper_1', assignmentStorage, reviewRequestStore });
  expect(emails.sort()).toEqual(['a@example.com', 'b@example.com', 'c@example.com'].sort());
});

test('getNonDeclinedEmails handles missing assigned list', () => {
  const assignmentStorage = createAssignmentStorage({ id: 'paper_2', assignedRefereeEmails: null });
  const reviewRequestStore = createReviewRequestStore([
    { paperId: 'paper_2', reviewerEmail: 'pending@example.com', status: 'sent' },
  ]);

  const emails = refereeCount.getNonDeclinedEmails({ paperId: 'paper_2', assignmentStorage, reviewRequestStore });
  expect(emails).toEqual(['pending@example.com']);
});

test('getCount returns number of non-declined referees', () => {
  const assignmentStorage = createAssignmentStorage({ id: 'paper_3', assignedRefereeEmails: ['a@example.com'] });
  const reviewRequestStore = createReviewRequestStore([
    { paperId: 'paper_3', reviewerEmail: 'b@example.com', status: 'sent' },
  ]);

  const count = refereeCount.getCount({ paperId: 'paper_3', assignmentStorage, reviewRequestStore });
  expect(count).toBe(2);
});

test('getNonDeclinedEmails throws with default storage when missing paper', () => {
  expect(() => refereeCount.getNonDeclinedEmails()).toThrow('paper_not_found');
});

test('getCount throws with default storage when missing paper', () => {
  expect(() => refereeCount.getCount()).toThrow('paper_not_found');
});
