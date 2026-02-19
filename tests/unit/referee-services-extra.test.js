import { refereeAssignmentGuard } from '../../src/services/referee-assignment-guard.js';
import { refereeGuidance } from '../../src/services/referee-guidance.js';
import { refereeInvitationCheck } from '../../src/services/referee-invitation-check.js';
import { assignmentStorage } from '../../src/services/assignment-storage.js';
import { reviewRequestStore } from '../../src/services/review-request-store.js';
import { createReviewRequest } from '../../src/models/review_request.js';

function createReviewRequestStore(requests) {
  return {
    getRequests: () => requests,
  };
}

test('refereeAssignmentGuard blocks when count is at least three', () => {
  const result = refereeAssignmentGuard.canAssign({
    paperId: 'paper_1',
    refereeCount: { getCount: () => 3 },
    assignmentStorage: {},
    reviewRequestStore: {},
  });
  expect(result).toEqual({ ok: false, reason: 'fourth_assignment', count: 3 });
});

test('refereeAssignmentGuard allows when count is below three', () => {
  const result = refereeAssignmentGuard.canAssign({
    paperId: 'paper_2',
    refereeCount: { getCount: () => 2 },
    assignmentStorage: {},
    reviewRequestStore: {},
  });
  expect(result).toEqual({ ok: true, count: 2 });
});

test('refereeAssignmentGuard uses default stores', () => {
  assignmentStorage.reset();
  reviewRequestStore.reset();
  assignmentStorage.seedPaper({
    id: 'paper_default',
    title: 'Paper',
    status: 'Submitted',
    assignedRefereeEmails: ['a@example.com', 'b@example.com', 'c@example.com'],
    assignmentVersion: 0,
  });
  const result = refereeAssignmentGuard.canAssign({ paperId: 'paper_default' });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('fourth_assignment');
});

test('refereeAssignmentGuard throws when missing args', () => {
  assignmentStorage.reset();
  reviewRequestStore.reset();
  expect(() => refereeAssignmentGuard.canAssign()).toThrow('paper_not_found');
});

test('refereeGuidance returns null for non-numeric counts', () => {
  expect(refereeGuidance.getGuidance({ count: '3' })).toBeNull();
});

test('refereeInvitationCheck respects disabled invitations', () => {
  const result = refereeInvitationCheck.getMissingInvitations({
    paperId: 'paper_3',
    invitationsEnabled: false,
    assignmentStorage: {},
    reviewRequestStore: createReviewRequestStore([]),
    refereeCount: { getNonDeclinedEmails: () => ['a@example.com'] },
  });
  expect(result).toEqual([]);
});

test('refereeInvitationCheck returns missing invitations', () => {
  const reviewRequestStore = createReviewRequestStore([
    { paperId: 'paper_4', reviewerEmail: 'a@example.com', status: 'sent' },
    { paperId: 'paper_4', reviewerEmail: 'b@example.com', status: 'failed' },
    { paperId: 'paper_4', reviewerEmail: 'pending@example.com', status: 'pending' },
    { paperId: 'paper_4', reviewerEmail: 'invited@example.com', status: 'pending', decision: 'accept' },
    { paperId: 'paper_5', reviewerEmail: 'c@example.com', status: 'sent' },
  ]);
  const result = refereeInvitationCheck.getMissingInvitations({
    paperId: 'paper_4',
    assignmentStorage: {},
    reviewRequestStore,
    refereeCount: { getNonDeclinedEmails: () => ['a@example.com', 'b@example.com', 'invited@example.com', 'pending@example.com'] },
  });
  expect(result).toEqual(['b@example.com', 'pending@example.com']);
});

test('refereeInvitationCheck uses default stores', () => {
  assignmentStorage.reset();
  reviewRequestStore.reset();
  assignmentStorage.seedPaper({
    id: 'paper_invite',
    title: 'Paper',
    status: 'Submitted',
    assignedRefereeEmails: ['a@example.com', 'b@example.com'],
    assignmentVersion: 0,
  });
  reviewRequestStore.addRequest(createReviewRequest({
    assignmentId: 'assign_1',
    paperId: 'paper_invite',
    reviewerEmail: 'a@example.com',
    status: 'sent',
  }));
  const result = refereeInvitationCheck.getMissingInvitations({ paperId: 'paper_invite' });
  expect(result).toEqual(['b@example.com']);
});

test('refereeInvitationCheck throws when called without args', () => {
  assignmentStorage.reset();
  reviewRequestStore.reset();
  expect(() => refereeInvitationCheck.getMissingInvitations()).toThrow('paper_not_found');
});
