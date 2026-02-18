import { createReviewReadinessView } from '../../src/views/review-readiness-view.js';
import { createReviewReadinessController } from '../../src/controllers/review-readiness-controller.js';
import { createRefereeGuidanceView } from '../../src/views/referee-guidance-view.js';
import { assignmentStorage } from '../../src/services/assignment-storage.js';
import { reviewRequestStore } from '../../src/services/review-request-store.js';
import { sessionState } from '../../src/models/session-state.js';

function setupReadiness(paperId) {
  const readinessView = createReviewReadinessView();
  const guidanceView = createRefereeGuidanceView();
  document.body.appendChild(readinessView.element);
  document.body.appendChild(guidanceView.element);
  const controller = createReviewReadinessController({
    view: readinessView,
    guidanceView,
    assignmentStorage,
    reviewRequestStore,
    sessionState,
    paperId,
  });
  controller.init();
  return { readinessView, guidanceView, controller };
}

beforeEach(() => {
  assignmentStorage.reset();
  reviewRequestStore.reset();
  sessionState.clear();
  document.body.innerHTML = '';
});

test('AT-UC17-04: guidance provides add action when count is low', () => {
  assignmentStorage.seedPaper({
    id: 'paper_low',
    title: 'Low',
    status: 'Eligible',
    assignedRefereeEmails: ['a@example.com', 'b@example.com'],
  });
  sessionState.authenticate({ id: 'acct_1', email: 'editor@example.com', role: 'Editor' });
  const { guidanceView, controller } = setupReadiness('paper_low');
  controller.evaluateReadiness();
  expect(guidanceView.element.querySelector('#guidance-message').textContent).toContain('Add');
  expect(guidanceView.element.querySelector('#guidance-action').textContent).toContain('Add');
});

test('AT-UC17-05: guidance provides remove action when count is high', () => {
  assignmentStorage.seedPaper({
    id: 'paper_high',
    title: 'High',
    status: 'Eligible',
    assignedRefereeEmails: ['a@example.com', 'b@example.com', 'c@example.com', 'd@example.com'],
  });
  sessionState.authenticate({ id: 'acct_1', email: 'editor@example.com', role: 'Editor' });
  const { guidanceView, controller } = setupReadiness('paper_high');
  controller.evaluateReadiness();
  expect(guidanceView.element.querySelector('#guidance-message').textContent).toContain('Remove');
  expect(guidanceView.element.querySelector('#guidance-action').textContent).toContain('Remove');
});
