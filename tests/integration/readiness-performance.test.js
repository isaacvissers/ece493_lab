import { createReviewReadinessView } from '../../src/views/review-readiness-view.js';
import { createReviewReadinessController } from '../../src/controllers/review-readiness-controller.js';
import { assignmentStorage } from '../../src/services/assignment-storage.js';
import { reviewRequestStore } from '../../src/services/review-request-store.js';
import { sessionState } from '../../src/models/session-state.js';

beforeEach(() => {
  assignmentStorage.reset();
  reviewRequestStore.reset();
  sessionState.clear();
  document.body.innerHTML = '';
});

test('readiness evaluation completes within 2 seconds', () => {
  assignmentStorage.seedPaper({
    id: 'paper_perf',
    title: 'Perf',
    status: 'Eligible',
    assignedRefereeEmails: ['a@example.com', 'b@example.com', 'c@example.com'],
  });
  sessionState.authenticate({ id: 'acct_1', email: 'editor@example.com', role: 'Editor' });
  const view = createReviewReadinessView();
  document.body.appendChild(view.element);
  const controller = createReviewReadinessController({
    view,
    assignmentStorage,
    reviewRequestStore,
    sessionState,
    paperId: 'paper_perf',
  });
  controller.init();
  const start = Date.now();
  controller.evaluateReadiness();
  const duration = Date.now() - start;
  expect(duration).toBeLessThan(2000);
});
