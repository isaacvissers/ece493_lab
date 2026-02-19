import { createReviewForm, isFormClosed } from '../../src/models/review-form.js';
import { createSubmittedReview, isSubmittedReviewFinal } from '../../src/models/submitted-review.js';

test('review form closed state', () => {
  const activeForm = createReviewForm({ paperId: 'paper_1', status: 'active' });
  const closedForm = createReviewForm({ paperId: 'paper_2', status: 'closed' });
  expect(isFormClosed(activeForm)).toBe(false);
  expect(isFormClosed(closedForm)).toBe(true);
  expect(isFormClosed({ status: null })).toBe(false);
});

test('submitted review is final when status submitted', () => {
  const review = createSubmittedReview({ paperId: 'paper_1', reviewerEmail: 'rev@example.com' });
  const draft = createSubmittedReview({ paperId: 'paper_1', reviewerEmail: 'rev@example.com', status: 'draft' });
  expect(isSubmittedReviewFinal(review)).toBe(true);
  expect(isSubmittedReviewFinal(draft)).toBe(false);
});
