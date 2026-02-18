import { auditLogService } from '../../src/services/audit-log-service.js';
import { createReviewSubmitController } from '../../src/controllers/review-submit-controller.js';
import { createReview } from '../../src/models/review.js';
import { createPaper } from '../../src/models/paper.js';

beforeEach(() => {
  auditLogService.reset();
});

test('audit log failure does not block delivery', () => {
  auditLogService.setFailureMode(true);
  const review = createReview({ reviewId: 'rev_audit', paperId: 'paper_1', reviewerId: 'rev', status: 'submitted' });
  const paper = createPaper({ paperId: 'paper_1', editorId: 'editor_1' });

  const controller = createReviewSubmitController({
    review,
    paper,
    auditLogService,
    adminFlagService: { addFlag: () => {} },
  });

  const result = controller.submit();
  expect(result.ok).toBe(true);
});
