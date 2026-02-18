import { createReviewSubmitController } from '../../src/controllers/review-submit-controller.js';
import { createReview } from '../../src/models/review.js';
import { createPaper } from '../../src/models/paper.js';
import { notificationService } from '../../src/services/notification-service.js';

beforeEach(() => {
  notificationService.clear();
});

test('notification generated for both channels', () => {
  const review = createReview({ reviewId: 'rev_note', paperId: 'paper_1', reviewerId: 'rev', status: 'submitted' });
  const paper = createPaper({ paperId: 'paper_1', editorId: 'editor_1' });

  const controller = createReviewSubmitController({
    review,
    paper,
    notificationsEnabled: true,
    auditLogService: { log: () => {} },
    adminFlagService: { addFlag: () => {} },
  });

  const result = controller.submit();
  expect(result.ok).toBe(true);
  expect(notificationService.getReviewNotifications()).toHaveLength(1);
});
