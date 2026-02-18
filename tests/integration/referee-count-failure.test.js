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

test('readiness controller surfaces count lookup failures', () => {
  assignmentStorage.seedPaper({
    id: 'paper_fail',
    title: 'Failure Paper',
    status: 'Eligible',
    assignedRefereeEmails: ['a@example.com'],
  });
  reviewRequestStore.setLookupFailureMode(true);
  sessionState.authenticate({ id: 'acct_1', email: 'editor@example.com', role: 'Editor' });
  const view = createReviewReadinessView();
  document.body.appendChild(view.element);
  const controller = createReviewReadinessController({
    view,
    assignmentStorage,
    reviewRequestStore,
    sessionState,
    paperId: 'paper_fail',
  });
  controller.init();
  controller.evaluateReadiness();
  expect(view.element.querySelector('#readiness-banner').textContent).toContain('Unable to determine referee count');
});
