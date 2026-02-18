import { createReviewReadinessView } from '../../src/views/review-readiness-view.js';
import { createReviewReadinessController } from '../../src/controllers/review-readiness-controller.js';
import { assignmentStorage } from '../../src/services/assignment-storage.js';
import { reviewRequestStore } from '../../src/services/review-request-store.js';
import { sessionState } from '../../src/models/session-state.js';
import { errorLog } from '../../src/services/error-log.js';

function setupReadiness(paperId) {
  const view = createReviewReadinessView();
  document.body.appendChild(view.element);
  const controller = createReviewReadinessController({
    view,
    assignmentStorage,
    reviewRequestStore,
    sessionState,
    paperId,
  });
  controller.init();
  return { view, controller };
}

beforeEach(() => {
  assignmentStorage.reset();
  reviewRequestStore.reset();
  errorLog.clear();
  sessionState.clear();
  document.body.innerHTML = '';
});

test('AT-UC17-06..07: lookup failure blocks readiness and logs failure', () => {
  assignmentStorage.seedPaper({
    id: 'paper_fail',
    title: 'Failure Paper',
    status: 'Eligible',
    assignedRefereeEmails: ['a@example.com', 'b@example.com'],
  });
  reviewRequestStore.setLookupFailureMode(true);
  sessionState.authenticate({ id: 'acct_1', email: 'editor@example.com', role: 'Editor' });
  const { view, controller } = setupReadiness('paper_fail');
  const result = controller.evaluateReadiness();
  expect(result.ok).toBe(false);
  expect(view.element.querySelector('#readiness-banner').textContent).toContain('Unable to determine referee count');
  expect(errorLog.getFailures().length).toBeGreaterThan(0);
});
