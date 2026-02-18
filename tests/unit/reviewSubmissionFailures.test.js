import { reviewSubmissionService } from '../../src/services/review-submission-service.js';
import { assignmentStore } from '../../src/services/assignment-store.js';
import { reviewFormStore } from '../../src/services/review-form-store.js';
import { reviewDraftStore } from '../../src/services/review-draft-store.js';
import { errorLog } from '../../src/services/error-log.js';
import { createAssignment } from '../../src/models/assignment.js';
import { createReviewForm } from '../../src/models/review-form.js';
import { REQUIRED_REVIEW_FIELDS } from '../../src/models/review-constants.js';

const content = {
  summary: 'Summary',
  commentsToAuthors: 'Comments',
  recommendation: 'accept',
  confidenceRating: 4,
};

beforeEach(() => {
  assignmentStore.reset();
  reviewFormStore.reset();
  reviewDraftStore.reset();
  reviewSubmissionService.reset();
  errorLog.clear();
});

test('logs failures when submission storage fails', () => {
  assignmentStore.addAssignment(createAssignment({
    paperId: 'paper_1',
    reviewerEmail: 'rev@example.com',
    status: 'accepted',
  }));
  reviewFormStore.saveForm(createReviewForm({ paperId: 'paper_1', status: 'active', requiredFields: REQUIRED_REVIEW_FIELDS }));
  reviewSubmissionService.setSubmissionFailureMode(true);

  const result = reviewSubmissionService.submit({
    paperId: 'paper_1',
    reviewerEmail: 'rev@example.com',
    content,
  });

  expect(result.ok).toBe(false);
  expect(result.reason).toBe('save_failed');
  expect(errorLog.getFailures().some((entry) => entry.errorType === 'review_submission_failed')).toBe(true);
});

test('preserves draft on request', () => {
  const result = reviewSubmissionService.preserveDraft({
    paperId: 'paper_2',
    reviewerEmail: 'rev@example.com',
    content,
    errors: { summary: 'required' },
  });

  expect(result.ok).toBe(true);
  const draft = reviewDraftStore.getDraft('paper_2', 'rev@example.com');
  expect(draft).not.toBeNull();
  expect(draft.validationErrors.summary).toBe('required');
});

test('logs failure when draft preservation fails', () => {
  reviewDraftStore.setFailureMode(true);
  const result = reviewSubmissionService.preserveDraft({
    paperId: 'paper_3',
    reviewerEmail: 'rev@example.com',
    content,
  });

  expect(result.ok).toBe(false);
  expect(errorLog.getFailures().some((entry) => entry.errorType === 'review_draft_preserve_failed')).toBe(true);
});
