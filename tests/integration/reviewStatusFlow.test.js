import { createReviewStatusController } from '../../src/controllers/review-status-controller.js';
import { reviewSubmissionService } from '../../src/services/review-submission-service.js';
import { assignmentStore } from '../../src/services/assignment-store.js';
import { reviewFormStore } from '../../src/services/review-form-store.js';
import { sessionState } from '../../src/models/session-state.js';
import { createAssignment } from '../../src/models/assignment.js';
import { createReviewForm } from '../../src/models/review-form.js';
import { REQUIRED_REVIEW_FIELDS } from '../../src/models/review-constants.js';

beforeEach(() => {
  assignmentStore.reset();
  reviewFormStore.reset();
  reviewSubmissionService.reset();
  sessionState.clear();
});

test('returns submitted status for reviewer', () => {
  assignmentStore.addAssignment(createAssignment({ paperId: 'paper_8', reviewerEmail: 'rev@example.com', status: 'accepted' }));
  reviewFormStore.saveForm(createReviewForm({ paperId: 'paper_8', status: 'active', requiredFields: REQUIRED_REVIEW_FIELDS }));
  sessionState.authenticate({ id: 'acct_8', email: 'rev@example.com', role: 'Reviewer' });

  reviewSubmissionService.submit({
    paperId: 'paper_8',
    reviewerEmail: 'rev@example.com',
    content: {
      summary: 'Summary',
      commentsToAuthors: 'Comments',
      recommendation: 'accept',
      confidenceRating: 4,
    },
  });

  const view = { setStatus: jest.fn() };
  const controller = createReviewStatusController({ view, sessionState, paperId: 'paper_8' });
  controller.init();

  expect(view.setStatus).toHaveBeenCalledWith(expect.stringContaining('submitted'), false);
});
