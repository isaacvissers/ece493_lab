import { jest } from '@jest/globals';

const loadWithSubmissionMock = async () => {
  await jest.unstable_mockModule('../../src/models/submitted-review.js', () => ({
    createSubmittedReview: () => { throw {}; },
    isSubmittedReviewFinal: () => false,
  }));
  return import('../../src/services/review-submission-service.js');
};

test('reviewSubmissionService logs fallback message when submission throws without message', async () => {
  const { reviewSubmissionService } = await loadWithSubmissionMock();
  reviewSubmissionService.reset();

  const errorLog = { logFailure: jest.fn() };
  const result = reviewSubmissionService.submit({
    paperId: 'paper_fallback',
    reviewerEmail: 'rev@example.com',
    content: { summary: 'Ok' },
    assignmentStore: {
      getAssignments: () => [{ paperId: 'paper_fallback', reviewerEmail: 'rev@example.com', status: 'accepted' }],
    },
    reviewFormStore: { getForm: () => ({ paperId: 'paper_fallback', status: 'active', requiredFields: [] }) },
    reviewDraftStore: { getDraft: () => null },
    reviewValidationService: { validate: () => ({ ok: true }) },
    errorLog,
  });

  expect(result.ok).toBe(false);
  expect(errorLog.logFailure).toHaveBeenCalledWith(expect.objectContaining({
    message: 'submission_failed',
  }));
});
