import { createDecisionEntryView } from '../../src/views/decisionEntryView.js';
import { createDecisionController } from '../../src/controllers/decisionController.js';
import { decisionEligibilityService } from '../../src/services/decisionEligibilityService.js';
import { decisionService } from '../../src/services/decisionService.js';
import { assignmentStorage } from '../../src/services/assignment-storage.js';
import { sessionState } from '../../src/models/session-state.js';
import { auditLogService } from '../../src/services/audit-log-service.js';
import { authorNotificationService } from '../../src/services/authorNotificationService.js';

function seedReviews(entries) {
  localStorage.setItem('cms.submitted_reviews', JSON.stringify(entries));
}

beforeEach(() => {
  assignmentStorage.reset();
  decisionService.reset();
  authorNotificationService.reset();
  auditLogService.reset();
  sessionState.clear();
  document.body.innerHTML = '';
  localStorage.removeItem('cms.submitted_reviews');
});

test('displays the three completed reviews before decision', () => {
  assignmentStorage.seedPaper({ id: 'paper_reviews', title: 'Paper', status: 'submitted', editorId: 'editor_1' });
  seedReviews([
    { paperId: 'paper_reviews', status: 'submitted', content: { summary: 'Review A' } },
    { paperId: 'paper_reviews', status: 'submitted', content: { summary: 'Review B' } },
    { paperId: 'paper_reviews', status: 'submitted', content: { summary: 'Review C' } },
  ]);
  sessionState.authenticate({ id: 'editor_1', email: 'editor@example.com', role: 'Editor', createdAt: new Date().toISOString() });

  const view = createDecisionEntryView();
  document.body.appendChild(view.element);
  const controller = createDecisionController({
    view,
    paperId: 'paper_reviews',
    sessionState,
    assignmentStorage,
    decisionEligibilityService,
    decisionService,
    auditLogService,
    authorNotificationService,
  });
  controller.init();

  const reviews = view.element.querySelectorAll('.decision-review');
  expect(reviews).toHaveLength(3);
  expect(view.element.textContent).toContain('Review A');
  expect(view.element.textContent).toContain('Review B');
  expect(view.element.textContent).toContain('Review C');
});
