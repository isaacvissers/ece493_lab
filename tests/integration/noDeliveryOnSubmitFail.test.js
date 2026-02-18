import { createReviewSubmitController } from '../../src/controllers/review-submit-controller.js';
import { createReview } from '../../src/models/review.js';
import { createPaper } from '../../src/models/paper.js';
import { reviewDeliveryService } from '../../src/services/review-delivery-service.js';

beforeEach(() => {
  reviewDeliveryService.reset();
});

test('failed submission does not deliver', () => {
  const review = createReview({ reviewId: 'rev_fail', paperId: 'paper_1', reviewerId: 'rev', status: 'draft' });
  const paper = createPaper({ paperId: 'paper_1', editorId: 'editor_1' });
  const controller = createReviewSubmitController({
    review,
    paper,
    deliveryService: reviewDeliveryService,
    auditLogService: { log: () => {} },
    adminFlagService: { addFlag: () => {} },
  });

  const result = controller.submit();
  expect(result.ok).toBe(false);
  expect(reviewDeliveryService.getEditorReviews('editor_1')).toHaveLength(0);
});
