import { createReviewSubmitController } from '../../src/controllers/review-submit-controller.js';
import { createReview } from '../../src/models/review.js';
import { createPaper } from '../../src/models/paper.js';
import { reviewDeliveryService } from '../../src/services/review-delivery-service.js';
import { notificationService } from '../../src/services/notification-service.js';

beforeEach(() => {
  reviewDeliveryService.reset();
  notificationService.clear();
});

test('notification failure does not block delivery', () => {
  notificationService.setReviewFailureMode(true);
  const review = createReview({ reviewId: 'rev_nf', paperId: 'paper_1', reviewerId: 'rev', status: 'submitted' });
  const paper = createPaper({ paperId: 'paper_1', editorId: 'editor_1' });

  const controller = createReviewSubmitController({
    review,
    paper,
    deliveryService: reviewDeliveryService,
    notificationsEnabled: true,
    auditLogService: { log: () => {} },
    adminFlagService: { addFlag: () => {} },
  });

  const result = controller.submit();
  expect(result.ok).toBe(true);
  expect(reviewDeliveryService.getEditorReviews('editor_1')).toHaveLength(1);
});
