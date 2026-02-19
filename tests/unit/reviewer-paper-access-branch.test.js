import { jest } from '@jest/globals';

const loadWithManuscriptOverride = async () => {
  await jest.unstable_mockModule('../../src/models/manuscript.js', () => ({
    isManuscriptAvailable: () => true,
  }));
  return import('../../src/services/reviewer-paper-access.js');
};

test('reviewerPaperAccess returns null manuscriptLink when file missing', async () => {
  const { reviewerPaperAccess } = await loadWithManuscriptOverride();

  const result = reviewerPaperAccess.getPaperDetails({
    reviewerEmail: 'reviewer@example.com',
    paperId: 'paper_1',
    assignmentStore: {
      getAssignments: () => [
        { paperId: 'paper_1', reviewerEmail: 'reviewer@example.com', status: 'accepted' },
      ],
    },
    assignmentStorage: { getPaper: () => ({ id: 'paper_1', status: 'available' }) },
    submissionStorage: { getManuscripts: () => [{ id: 'paper_1', title: 'Paper', file: null }] },
  });

  expect(result.ok).toBe(true);
  expect(result.manuscriptLink).toBeNull();
});
