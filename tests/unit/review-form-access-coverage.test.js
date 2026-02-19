import { reviewFormAccess } from '../../src/services/review-form-access.js';

test('reviewFormAccess returns unauthorized when reviewerEmail is whitespace', () => {
  const result = reviewFormAccess.getForm({ paperId: 'paper_whitespace', reviewerEmail: '   ' });
  expect(result.reason).toBe('not_assigned');
});

test('reviewFormAccess normalizes reviewer email before lookup', () => {
  const result = reviewFormAccess.getForm({
    paperId: 'paper_norm',
    reviewerEmail: ' ReV@Example.com ',
    assignmentStore: {
      getAssignments: () => [
        { paperId: 'paper_norm', reviewerEmail: 'rev@example.com', status: 'accepted' },
      ],
    },
    reviewFormStore: { getForm: () => ({ paperId: 'paper_norm', status: 'active' }) },
    reviewDraftStore: { getDraft: () => null },
  });

  expect(result.ok).toBe(true);
});
