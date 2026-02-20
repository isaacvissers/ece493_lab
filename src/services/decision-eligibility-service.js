import { REQUIRED_REVIEW_COUNT } from '../models/decision-constants.js';

const SUBMISSIONS_KEY = 'cms.submitted_reviews';

function loadReviews() {
  const raw = localStorage.getItem(SUBMISSIONS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function normalizeId(paper) {
  if (!paper) {
    return null;
  }
  return paper.id || paper.paperId || null;
}

export const decisionEligibilityService = {
  getSubmittedReviews(paperId) {
    if (!paperId) {
      return [];
    }
    return loadReviews().filter((entry) => (
      entry && entry.paperId === paperId && entry.status === 'submitted'
    ));
  },
  getReviewCount(paperId) {
    return decisionEligibilityService.getSubmittedReviews(paperId).length;
  },
  isEligible(paperId) {
    return decisionEligibilityService.getReviewCount(paperId) === REQUIRED_REVIEW_COUNT;
  },
  getEligiblePapers(papers = []) {
    const list = Array.isArray(papers) ? papers : [];
    return list.filter((paper) => {
      const paperId = normalizeId(paper);
      if (!paperId) {
        return false;
      }
      return decisionEligibilityService.isEligible(paperId);
    });
  },
};
