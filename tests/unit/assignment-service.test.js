import { assignmentService } from '../../src/services/assignment-service.js';
import { assignmentStore } from '../../src/services/assignment-store.js';
import { reviewRequestService } from '../../src/services/review-request-service.js';
import { reviewRequestStore } from '../../src/services/review-request-store.js';
import { createAssignment } from '../../src/models/assignment.js';

beforeEach(() => {
  assignmentStore.reset();
  reviewRequestStore.reset();
  reviewRequestService.setDeliveryFailureMode(false);
});

test('assigns reviewers under limit', () => {
  const result = assignmentService.assignReviewers({
    paperId: 'paper_1',
    reviewerEmails: ['a@example.com', 'b@example.com', 'c@example.com'],
  });
  expect(result.assigned).toHaveLength(3);
  expect(result.rejected).toHaveLength(0);
  expect(result.createdAssignments).toHaveLength(3);
});

test('handles non-array reviewer list', () => {
  const result = assignmentService.assignReviewers({
    paperId: 'paper_1',
    reviewerEmails: null,
  });
  expect(result.assigned).toHaveLength(0);
  expect(result.rejected).toHaveLength(0);
});

test('assignReviewers handles missing args', () => {
  const result = assignmentService.assignReviewers();
  expect(result.assigned).toHaveLength(0);
  expect(result.rejected).toHaveLength(0);
});

test('rejects reviewer at limit', () => {
  for (let i = 0; i < 5; i += 1) {
    assignmentStore.addAssignment(createAssignment({ paperId: `paper_${i}`, reviewerEmail: 'limit@example.com' }));
  }
  const result = assignmentService.assignReviewers({
    paperId: 'paper_6',
    reviewerEmails: ['limit@example.com'],
  });
  expect(result.assigned).toHaveLength(0);
  expect(result.rejected[0].reason).toBe('limit_reached');
});

test('rejects on lookup failure', () => {
  assignmentStore.setLookupFailureMode(true);
  const result = assignmentService.assignReviewers({
    paperId: 'paper_1',
    reviewerEmails: ['lookup@example.com'],
  });
  expect(result.rejected[0].reason).toBe('lookup_failed');
  assignmentStore.setLookupFailureMode(false);
});

test('rejects on save failure', () => {
  assignmentStore.setSaveFailureMode(true);
  const result = assignmentService.assignReviewers({
    paperId: 'paper_1',
    reviewerEmails: ['save@example.com'],
  });
  expect(result.rejected[0].reason).toBe('save_failed');
  assignmentStore.setSaveFailureMode(false);
});

test('rejects duplicate assignment', () => {
  assignmentStore.addAssignment(createAssignment({ paperId: 'paper_1', reviewerEmail: 'dup@example.com' }));
  const result = assignmentService.assignReviewers({
    paperId: 'paper_1',
    reviewerEmails: ['dup@example.com'],
  });
  expect(result.rejected[0].reason).toBe('already_assigned');
});

test('maps limit reached from addAssignment', () => {
  for (let i = 0; i < 5; i += 1) {
    assignmentStore.addAssignment(createAssignment({ paperId: `paper_${i}`, reviewerEmail: 'limit@example.com' }));
  }
  const original = assignmentStore.getActiveCountForReviewer;
  assignmentStore.getActiveCountForReviewer = () => 0;
  const result = assignmentService.assignReviewers({
    paperId: 'paper_6',
    reviewerEmails: ['limit@example.com'],
  });
  expect(result.rejected[0].reason).toBe('limit_reached');
  assignmentStore.getActiveCountForReviewer = original;
});

test('maps undefined errors to save_failed', () => {
  const original = assignmentStore.hasActiveAssignment;
  assignmentStore.hasActiveAssignment = () => {
    throw undefined;
  };
  const result = assignmentService.assignReviewers({
    paperId: 'paper_1',
    reviewerEmails: ['undef@example.com'],
  });
  expect(result.rejected[0].reason).toBe('save_failed');
  assignmentStore.hasActiveAssignment = original;
});

test('maps lookup failure during count check', () => {
  const original = assignmentStore.getActiveCountForReviewer;
  assignmentStore.getActiveCountForReviewer = () => {
    throw new Error('lookup_failure');
  };
  const result = assignmentService.assignReviewers({
    paperId: 'paper_1',
    reviewerEmails: ['count@example.com'],
  });
  expect(result.rejected[0].reason).toBe('lookup_failed');
  assignmentStore.getActiveCountForReviewer = original;
});

test('maps duplicate assignment from addAssignment', () => {
  assignmentStore.addAssignment(createAssignment({ paperId: 'paper_1', reviewerEmail: 'dup2@example.com' }));
  const original = assignmentStore.hasActiveAssignment;
  assignmentStore.hasActiveAssignment = () => false;
  const result = assignmentService.assignReviewers({
    paperId: 'paper_1',
    reviewerEmails: ['dup2@example.com'],
  });
  expect(result.rejected[0].reason).toBe('already_assigned');
  assignmentStore.hasActiveAssignment = original;
});

test('rejects missing email input', () => {
  const result = assignmentService.assignReviewers({
    paperId: 'paper_1',
    reviewerEmails: [''],
  });
  expect(result.rejected[0].reason).toBe('lookup_failed');
});

test('maps unknown errors to save_failed', () => {
  const original = assignmentStore.addAssignment;
  assignmentStore.addAssignment = () => {
    throw new Error('weird');
  };
  const result = assignmentService.assignReviewers({
    paperId: 'paper_1',
    reviewerEmails: ['weird@example.com'],
  });
  expect(result.rejected[0].reason).toBe('save_failed');
  assignmentStore.addAssignment = original;
});

test('submitAssignments returns evaluation failure on lookup error', () => {
  assignmentStore.setLookupFailureMode(true);
  const result = assignmentService.submitAssignments({
    paperId: 'paper_9',
    reviewerEmails: ['a@example.com'],
    assignmentGuard: null,
  });
  expect(result.ok).toBe(false);
  assignmentStore.setLookupFailureMode(false);
});

test('submitAssignments returns evaluation failure when guard throws', () => {
  const result = assignmentService.submitAssignments({
    paperId: 'paper_guard',
    reviewerEmails: ['a@example.com'],
    assignmentGuard: { canAssign: () => { throw new Error('guard_failed'); } },
  });
  expect(result.ok).toBe(false);
  expect(result.failure).toBe('evaluation_failed');
});

test('submitAssignments handles defaults with no args', () => {
  const result = assignmentService.submitAssignments();
  expect(result.ok).toBe(false);
  expect(result.failure).toBe('evaluation_failed');
});

test('submitAssignments sends review requests for valid entries', () => {
  const result = assignmentService.submitAssignments({
    paperId: 'paper_10',
    reviewerEmails: ['a@example.com'],
    assignmentGuard: { canAssign: () => ({ ok: true }) },
  });
  expect(result.ok).toBe(true);
  expect(result.accepted).toEqual(['a@example.com']);
  expect(reviewRequestStore.getRequests()).toHaveLength(1);
});

test('submitAssignments handles empty input', () => {
  const result = assignmentService.submitAssignments({
    paperId: 'paper_10',
    reviewerEmails: [],
    assignmentGuard: { canAssign: () => ({ ok: true }) },
  });
  expect(result.ok).toBe(true);
  expect(result.accepted).toHaveLength(0);
  expect(result.blocked).toHaveLength(0);
});

test('submitAssignments handles missing args', () => {
  const result = assignmentService.submitAssignments({ assignmentGuard: null });
  expect(result.ok).toBe(true);
  expect(result.accepted).toHaveLength(0);
});

test('submitAssignments reports delivery failures', () => {
  reviewRequestService.setDeliveryFailureMode(true);
  const result = assignmentService.submitAssignments({
    paperId: 'paper_11',
    reviewerEmails: ['a@example.com'],
    assignmentGuard: { canAssign: () => ({ ok: true }) },
  });
  expect(result.ok).toBe(true);
  expect(result.accepted).toHaveLength(0);
  expect(result.blocked[0].reason).toBe('delivery_failed');
});

test('submitAssignments reports duplicate requests', () => {
  assignmentService.submitAssignments({
    paperId: 'paper_12',
    reviewerEmails: ['a@example.com'],
    assignmentGuard: { canAssign: () => ({ ok: true }) },
  });
  const result = assignmentService.submitAssignments({
    paperId: 'paper_12',
    reviewerEmails: ['a@example.com'],
    assignmentGuard: { canAssign: () => ({ ok: true }) },
  });
  expect(result.blocked[0].reason).toBe('duplicate_request');
});

test('submitAssignments defaults missing failure reason', () => {
  const original = reviewRequestService.sendReviewRequests;
  reviewRequestService.sendReviewRequests = () => ({ sent: [], failed: [{ email: 'a@example.com' }] });
  const result = assignmentService.submitAssignments({
    paperId: 'paper_13',
    reviewerEmails: ['a@example.com'],
    assignmentGuard: { canAssign: () => ({ ok: true }) },
  });
  expect(result.blocked[0].reason).toBe('request_failed');
  reviewRequestService.sendReviewRequests = original;
});
