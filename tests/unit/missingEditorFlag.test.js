import { createReviewSubmitController } from '../../src/controllers/review-submit-controller.js';
import { createReview } from '../../src/models/review.js';
import { createPaper } from '../../src/models/paper.js';


test('flags missing editor mapping', () => {
  const review = createReview({ reviewId: 'rev_flag', paperId: 'paper_1', reviewerId: 'rev', status: 'submitted' });
  const paper = createPaper({ paperId: 'paper_1', editorId: null });
  const flags = { addFlag: jest.fn() };
  const controller = createReviewSubmitController({ review, paper, adminFlagService: flags, auditLogService: { log: () => {} } });

  const result = controller.submit();
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('missing_editor');
  expect(flags.addFlag).toHaveBeenCalled();
});
