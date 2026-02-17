import { assignmentStore } from '../../src/services/assignment-store.js';
import { createAssignment } from '../../src/models/assignment.js';

function addAssignment(paperId, reviewerEmail) {
  return assignmentStore.addAssignment(createAssignment({ paperId, reviewerEmail }), { limit: 5 });
}

beforeEach(() => {
  assignmentStore.reset();
});

test('adds assignments and counts active reviewers', () => {
  addAssignment('paper_1', 'reviewer@example.com');
  addAssignment('paper_2', 'reviewer@example.com');
  expect(assignmentStore.getActiveCountForReviewer('reviewer@example.com')).toBe(2);
  expect(assignmentStore.getActiveAssignmentsForReviewer('reviewer@example.com')).toHaveLength(2);
  expect(assignmentStore.hasActiveAssignment('paper_1', 'reviewer@example.com')).toBe(true);
});

test('prevents duplicate active assignments', () => {
  addAssignment('paper_1', 'reviewer@example.com');
  expect(() => addAssignment('paper_1', 'reviewer@example.com')).toThrow('duplicate_assignment');
});

test('enforces limit on add', () => {
  for (let i = 0; i < 5; i += 1) {
    addAssignment(`paper_${i}`, 'reviewer@example.com');
  }
  expect(() => addAssignment('paper_6', 'reviewer@example.com')).toThrow('limit_reached');
});

test('returns assignments from storage', () => {
  addAssignment('paper_1', 'reviewer@example.com');
  const assignments = assignmentStore.getAssignments();
  expect(assignments).toHaveLength(1);
});

test('loads assignments from localStorage', () => {
  assignmentStore.reset();
  localStorage.setItem('cms.reviewer_assignments', JSON.stringify([
    createAssignment({ id: 'asg_1', paperId: 'paper_1', reviewerEmail: 'reviewer@example.com' }),
  ]));
  const assignments = assignmentStore.getAssignments();
  expect(assignments).toHaveLength(1);
});

test('removes assignments for paper and reviewers', () => {
  addAssignment('paper_1', 'reviewer@example.com');
  addAssignment('paper_1', 'other@example.com');
  assignmentStore.removeAssignments({ paperId: 'paper_1', reviewerEmails: ['reviewer@example.com'] });
  expect(assignmentStore.getActiveCountForReviewer('reviewer@example.com')).toBe(0);
  expect(assignmentStore.getActiveCountForReviewer('other@example.com')).toBe(1);
});

test('removeAssignments handles missing reviewer list', () => {
  addAssignment('paper_1', 'reviewer@example.com');
  assignmentStore.removeAssignments({ paperId: 'paper_1' });
  expect(assignmentStore.getActiveCountForReviewer('reviewer@example.com')).toBe(1);
  assignmentStore.removeAssignments();
  expect(assignmentStore.getActiveCountForReviewer('reviewer@example.com')).toBe(1);
});

test('lookup failure throws', () => {
  assignmentStore.setLookupFailureMode(true);
  expect(() => assignmentStore.getAssignments()).toThrow('lookup_failure');
  assignmentStore.setLookupFailureMode(false);
});

test('save failure throws on add and remove', () => {
  assignmentStore.setSaveFailureMode(true);
  expect(() => addAssignment('paper_1', 'reviewer@example.com')).toThrow('save_failure');
  assignmentStore.setSaveFailureMode(false);
  addAssignment('paper_1', 'reviewer@example.com');
  assignmentStore.setSaveFailureMode(true);
  expect(() => assignmentStore.removeAssignments({ paperId: 'paper_1', reviewerEmails: ['reviewer@example.com'] }))
    .toThrow('save_failure');
});
