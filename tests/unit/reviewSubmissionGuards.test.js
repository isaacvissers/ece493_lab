import { reviewSubmissionService } from '../../src/services/review-submission-service.js';
import { assignmentStore } from '../../src/services/assignment-store.js';
import { reviewFormStore } from '../../src/services/review-form-store.js';
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
  reviewSubmissionService.reset();
});

test('blocks submission when reviewer is unassigned', () => {
  reviewFormStore.saveForm(createReviewForm({ paperId: 'paper_1', status: 'active', requiredFields: REQUIRED_REVIEW_FIELDS }));
  const result = reviewSubmissionService.submit({
    paperId: 'paper_1',
    reviewerEmail: 'rev@example.com',
    content,
  });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('not_assigned');
});

test('blocks submission when assignment not accepted', () => {
  assignmentStore.addAssignment(createAssignment({
    paperId: 'paper_2',
    reviewerEmail: 'rev@example.com',
    status: 'pending',
  }));
  reviewFormStore.saveForm(createReviewForm({ paperId: 'paper_2', status: 'active', requiredFields: REQUIRED_REVIEW_FIELDS }));
  const result = reviewSubmissionService.submit({
    paperId: 'paper_2',
    reviewerEmail: 'rev@example.com',
    content,
  });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('not_accepted');
});

test('blocks submission when review period closed', () => {
  assignmentStore.addAssignment(createAssignment({
    paperId: 'paper_3',
    reviewerEmail: 'rev@example.com',
    status: 'accepted',
  }));
  reviewFormStore.saveForm(createReviewForm({ paperId: 'paper_3', status: 'closed', requiredFields: REQUIRED_REVIEW_FIELDS }));
  const result = reviewSubmissionService.submit({
    paperId: 'paper_3',
    reviewerEmail: 'rev@example.com',
    content,
  });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('closed');
});

test('blocks duplicate submissions', () => {
  assignmentStore.addAssignment(createAssignment({
    paperId: 'paper_4',
    reviewerEmail: 'rev@example.com',
    status: 'accepted',
  }));
  reviewFormStore.saveForm(createReviewForm({ paperId: 'paper_4', status: 'active', requiredFields: REQUIRED_REVIEW_FIELDS }));
  const first = reviewSubmissionService.submit({
    paperId: 'paper_4',
    reviewerEmail: 'rev@example.com',
    content,
  });
  expect(first.ok).toBe(true);

  const second = reviewSubmissionService.submit({
    paperId: 'paper_4',
    reviewerEmail: 'rev@example.com',
    content,
  });
  expect(second.ok).toBe(false);
  expect(second.reason).toBe('duplicate');
});
