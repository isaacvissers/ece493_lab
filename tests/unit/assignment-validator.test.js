import { assignmentValidator } from '../../src/services/assignment-validator.js';

test('validates limit with count', () => {
  expect(assignmentValidator.validateLimit({ activeCount: 4, limit: 5 }).ok).toBe(true);
  expect(assignmentValidator.validateLimit({ activeCount: 5, limit: 5 }).reason).toBe('limit_reached');
});

test('fails validation when count is invalid', () => {
  expect(assignmentValidator.validateLimit({ activeCount: null, limit: 5 }).reason).toBe('lookup_failed');
  expect(assignmentValidator.validateLimit().reason).toBe('lookup_failed');
});

test('validates unique assignment', () => {
  expect(assignmentValidator.validateUniqueAssignment({ alreadyAssigned: true }).reason).toBe('already_assigned');
  expect(assignmentValidator.validateUniqueAssignment({ alreadyAssigned: false }).ok).toBe(true);
  expect(assignmentValidator.validateUniqueAssignment().ok).toBe(true);
});
