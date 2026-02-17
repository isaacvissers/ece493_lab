import { assignmentService } from '../../src/services/assignment-service.js';
import { assignmentStore } from '../../src/services/assignment-store.js';
import { createAssignment } from '../../src/models/assignment.js';

beforeEach(() => {
  assignmentStore.reset();
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
