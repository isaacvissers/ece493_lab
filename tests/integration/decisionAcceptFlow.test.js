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

test('accept decision saves and updates paper status', () => {
  assignmentStorage.seedPaper({ id: 'paper_accept', title: 'Paper', status: 'submitted', editorId: 'editor_1' });
  seedReviews([
    { paperId: 'paper_accept', status: 'submitted', content: { summary: 'Review A' } },
    { paperId: 'paper_accept', status: 'submitted', content: { summary: 'Review B' } },
    { paperId: 'paper_accept', status: 'submitted', content: { summary: 'Review C' } },
  ]);
  sessionState.authenticate({ id: 'editor_1', email: 'editor@example.com', role: 'Editor', createdAt: new Date().toISOString() });

  const view = createDecisionEntryView();
  document.body.appendChild(view.element);
  const controller = createDecisionController({
    view,
    paperId: 'paper_accept',
    sessionState,
    assignmentStorage,
    decisionEligibilityService,
    decisionService,
    auditLogService,
    authorNotificationService,
  });
  controller.init();

  view.element.querySelector('#decision-accept').checked = true;
  view.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

  const updated = assignmentStorage.getPaper('paper_accept');
  expect(updated.status).toBe('accepted');
  const decision = decisionService.getDecisionForPaper('paper_accept');
  expect(decision.value).toBe('accept');
});
