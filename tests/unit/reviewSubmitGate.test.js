import { createReviewSubmitController } from '../../src/controllers/review-submit-controller.js';
import { createReview } from '../../src/models/review.js';
import { createPaper } from '../../src/models/paper.js';

const noop = { deliverReview: () => ({ ok: true }) };
const audit = { log: () => {} };
const flags = { addFlag: () => {} };


test('does not deliver when review not submitted', () => {
  const review = createReview({ reviewId: 'rev_gate', paperId: 'paper_1', reviewerId: 'rev', status: 'draft' });
  const paper = createPaper({ paperId: 'paper_1', editorId: 'editor_1' });
  const controller = createReviewSubmitController({ review, paper, deliveryService: noop, auditLogService: audit, adminFlagService: flags });
  const result = controller.submit();
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('not_submitted');
});
