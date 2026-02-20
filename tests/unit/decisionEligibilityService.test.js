import { decisionEligibilityService } from '../../src/services/decisionEligibilityService.js';

function seedReviews(entries) {
  localStorage.setItem('cms.submitted_reviews', JSON.stringify(entries));
}

test('identifies papers with exactly three submitted reviews', () => {
  seedReviews([
    { paperId: 'paper_1', status: 'submitted' },
    { paperId: 'paper_1', status: 'submitted' },
    { paperId: 'paper_1', status: 'submitted' },
    { paperId: 'paper_2', status: 'submitted' },
    { paperId: 'paper_2', status: 'draft' },
    { paperId: 'paper_3', status: 'submitted' },
    { paperId: 'paper_3', status: 'submitted' },
    { paperId: 'paper_3', status: 'submitted' },
    { paperId: 'paper_3', status: 'submitted' },
  ]);

  expect(decisionEligibilityService.getReviewCount('paper_1')).toBe(3);
  expect(decisionEligibilityService.isEligible('paper_1')).toBe(true);
  expect(decisionEligibilityService.getReviewCount('paper_2')).toBe(1);
  expect(decisionEligibilityService.isEligible('paper_2')).toBe(false);
  expect(decisionEligibilityService.getReviewCount('paper_3')).toBe(4);
  expect(decisionEligibilityService.isEligible('paper_3')).toBe(false);

  const papers = [
    { id: 'paper_1', title: 'Eligible' },
    { id: 'paper_2', title: 'Too few' },
    { id: 'paper_3', title: 'Too many' },
  ];
  const eligible = decisionEligibilityService.getEligiblePapers(papers);
  expect(eligible).toHaveLength(1);
  expect(eligible[0].id).toBe('paper_1');
});

test('returns submitted reviews for a paper', () => {
  seedReviews([
    { paperId: 'paper_4', status: 'submitted', content: { summary: 'Review A' } },
    { paperId: 'paper_4', status: 'draft', content: { summary: 'Draft' } },
    { paperId: 'paper_4', status: 'submitted', content: { summary: 'Review B' } },
  ]);

  const reviews = decisionEligibilityService.getSubmittedReviews('paper_4');
  expect(reviews).toHaveLength(2);
  expect(reviews[0].content.summary).toBe('Review A');
});

test('handles missing paper ids and empty input', () => {
  seedReviews([]);
  expect(decisionEligibilityService.getSubmittedReviews()).toEqual([]);
  expect(decisionEligibilityService.getEligiblePapers([null, { title: 'No id' }])).toEqual([]);
  const eligible = decisionEligibilityService.getEligiblePapers([{ paperId: 'paper_x' }]);
  expect(eligible).toEqual([]);
});

test('returns empty results when no reviews are stored', () => {
  localStorage.removeItem('cms.submitted_reviews');
  expect(decisionEligibilityService.getReviewCount('paper_none')).toBe(0);
  expect(decisionEligibilityService.getEligiblePapers('not-an-array')).toEqual([]);
  expect(decisionEligibilityService.getEligiblePapers()).toEqual([]);
});
