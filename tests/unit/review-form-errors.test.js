import { jest } from '@jest/globals';
import { reviewFormAccess } from '../../src/services/review-form-access.js';
import { reviewFormStore } from '../../src/services/review-form-store.js';
import { reviewDraftStore } from '../../src/services/review-draft-store.js';
import { assignmentStore } from '../../src/services/assignment-store.js';
import { createAssignment } from '../../src/models/assignment.js';
import { createReviewForm } from '../../src/models/review-form.js';

beforeEach(() => {
  assignmentStore.reset();
  reviewFormStore.reset();
  reviewDraftStore.reset();
});

test('returns form_missing when form not configured', () => {
  assignmentStore.addAssignment(createAssignment({ paperId: 'paper_1', reviewerEmail: 'rev@example.com', status: 'accepted' }));
  const errorLog = { logFailure: jest.fn() };
  const result = reviewFormAccess.getForm({ paperId: 'paper_1', reviewerEmail: 'rev@example.com', errorLog });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('form_missing');
  expect(errorLog.logFailure).toHaveBeenCalled();
});

test('returns form_failure when form store fails', () => {
  assignmentStore.addAssignment(createAssignment({ paperId: 'paper_2', reviewerEmail: 'rev@example.com', status: 'accepted' }));
  reviewFormStore.setFailureMode(true);
  const errorLog = { logFailure: jest.fn() };
  const result = reviewFormAccess.getForm({ paperId: 'paper_2', reviewerEmail: 'rev@example.com', errorLog });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('form_failure');
  expect(errorLog.logFailure).toHaveBeenCalled();
});

test('returns draft_failure when draft store fails', () => {
  assignmentStore.addAssignment(createAssignment({ paperId: 'paper_3', reviewerEmail: 'rev@example.com', status: 'accepted' }));
  reviewFormStore.saveForm(createReviewForm({ paperId: 'paper_3', status: 'active' }));
  reviewDraftStore.setFailureMode(true);
  const errorLog = { logFailure: jest.fn() };
  const result = reviewFormAccess.getForm({ paperId: 'paper_3', reviewerEmail: 'rev@example.com', errorLog });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('draft_failure');
  expect(errorLog.logFailure).toHaveBeenCalled();
});
