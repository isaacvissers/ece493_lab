import { createReviewSubmitController } from '../../src/controllers/review-submit-controller.js';
import { createReview } from '../../src/models/review.js';
import { createPaper } from '../../src/models/paper.js';
import { adminFlagService } from '../../src/services/admin-flag-service.js';

beforeEach(() => {
  adminFlagService.reset();
});

test('missing editor mapping adds admin flag', () => {
  const review = createReview({ reviewId: 'rev_miss', paperId: 'paper_1', reviewerId: 'rev', status: 'submitted' });
  const paper = createPaper({ paperId: 'paper_1', editorId: null });

  const controller = createReviewSubmitController({
    review,
    paper,
    adminFlagService,
    auditLogService: { log: () => {} },
  });

  const result = controller.submit();
  expect(result.ok).toBe(false);
  expect(adminFlagService.getFlags()).toHaveLength(1);
});
