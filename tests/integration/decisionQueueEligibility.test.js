import { createDecisionQueueView } from '../../src/views/decisionQueueView.js';
import { decisionEligibilityService } from '../../src/services/decisionEligibilityService.js';
import { assignmentStorage } from '../../src/services/assignment-storage.js';

function seedReviews(entries) {
  localStorage.setItem('cms.submitted_reviews', JSON.stringify(entries));
}

beforeEach(() => {
  assignmentStorage.reset();
  document.body.innerHTML = '';
  localStorage.removeItem('cms.submitted_reviews');
});

test('decision queue lists only papers with exactly three reviews', () => {
  assignmentStorage.seedPaper({ id: 'paper_1', title: 'Eligible', status: 'submitted', editorId: 'editor_1' });
  assignmentStorage.seedPaper({ id: 'paper_2', title: 'Too Few', status: 'submitted', editorId: 'editor_1' });
  assignmentStorage.seedPaper({ id: 'paper_3', title: 'Too Many', status: 'submitted', editorId: 'editor_1' });

  seedReviews([
    { paperId: 'paper_1', status: 'submitted' },
    { paperId: 'paper_1', status: 'submitted' },
    { paperId: 'paper_1', status: 'submitted' },
    { paperId: 'paper_2', status: 'submitted' },
    { paperId: 'paper_2', status: 'submitted' },
    { paperId: 'paper_3', status: 'submitted' },
    { paperId: 'paper_3', status: 'submitted' },
    { paperId: 'paper_3', status: 'submitted' },
    { paperId: 'paper_3', status: 'submitted' },
  ]);

  const view = createDecisionQueueView();
  document.body.appendChild(view.element);

  const eligiblePapers = decisionEligibilityService.getEligiblePapers(assignmentStorage.getPapers());
  const queueItems = eligiblePapers.map((paper) => ({
    paper,
    reviewCount: decisionEligibilityService.getReviewCount(paper.id),
  }));
  view.setPapers(queueItems);

  const items = view.element.querySelectorAll('.decision-queue-item');
  expect(items).toHaveLength(1);
  expect(items[0].textContent).toContain('Eligible');
});
