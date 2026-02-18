import { createReviewReadinessView } from '../../src/views/review-readiness-view.js';
import { createReviewReadinessController } from '../../src/controllers/review-readiness-controller.js';
import { createReviewWorkflowController } from '../../src/controllers/review-workflow-controller.js';
import { assignmentStorage } from '../../src/services/assignment-storage.js';
import { reviewRequestStore } from '../../src/services/review-request-store.js';
import { sessionState } from '../../src/models/session-state.js';

function setupWorkflow(paperId) {
  const view = createReviewReadinessView();
  document.body.appendChild(view.element);
  const readinessController = createReviewReadinessController({
    view,
    assignmentStorage,
    reviewRequestStore,
    sessionState,
    paperId,
  });
  readinessController.init();
  const workflowController = createReviewWorkflowController({
    view,
    readinessController,
    assignmentStorage,
    paperId,
  });
  workflowController.init();
  return { view };
}

beforeEach(() => {
  assignmentStorage.reset();
  reviewRequestStore.reset();
  sessionState.clear();
  document.body.innerHTML = '';
});

test('readiness checkpoint starts review when count is three', () => {
  assignmentStorage.seedPaper({
    id: 'paper_ready',
    title: 'Ready',
    status: 'Eligible',
    assignedRefereeEmails: ['a@example.com', 'b@example.com', 'c@example.com'],
  });
  sessionState.authenticate({ id: 'acct_1', email: 'editor@example.com', role: 'Editor' });
  const { view } = setupWorkflow('paper_ready');
  view.element.querySelector('#start-review').click();
  const updated = assignmentStorage.getPaper('paper_ready');
  expect(updated.status.toLowerCase()).toBe('in_review');
  expect(view.element.querySelector('#readiness-banner').textContent).toContain('Review started');
});

test('readiness checkpoint blocks when count is incorrect', () => {
  assignmentStorage.seedPaper({
    id: 'paper_blocked',
    title: 'Blocked',
    status: 'Eligible',
    assignedRefereeEmails: ['a@example.com', 'b@example.com'],
  });
  sessionState.authenticate({ id: 'acct_1', email: 'editor@example.com', role: 'Editor' });
  const { view } = setupWorkflow('paper_blocked');
  view.element.querySelector('#start-review').click();
  const updated = assignmentStorage.getPaper('paper_blocked');
  expect(updated.status.toLowerCase()).toBe('eligible');
  expect(view.element.querySelector('#readiness-banner').textContent).toContain('blocked');
});
