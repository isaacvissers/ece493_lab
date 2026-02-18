import { createReviewFormView } from '../../src/views/review-form-view.js';
import { createReviewFormController } from '../../src/controllers/review-form-controller.js';
import { reviewFormStore } from '../../src/services/review-form-store.js';
import { assignmentStore } from '../../src/services/assignment-store.js';
import { sessionState } from '../../src/models/session-state.js';
import { createAssignment } from '../../src/models/assignment.js';
import { createReviewForm } from '../../src/models/review-form.js';

beforeEach(() => {
  assignmentStore.reset();
  reviewFormStore.reset();
  sessionState.clear();
  document.body.innerHTML = '';
});

test('review form access completes within 2 seconds', () => {
  assignmentStore.addAssignment(createAssignment({ paperId: 'paper_perf', reviewerEmail: 'rev@example.com', status: 'accepted' }));
  reviewFormStore.saveForm(createReviewForm({ paperId: 'paper_perf', status: 'active' }));
  sessionState.authenticate({ id: 'acct_1', email: 'rev@example.com', role: 'Reviewer' });

  const view = createReviewFormView();
  document.body.appendChild(view.element);
  const controller = createReviewFormController({ view, sessionState, paperId: 'paper_perf' });
  const start = Date.now();
  controller.init();
  const duration = Date.now() - start;
  expect(duration).toBeLessThan(2000);
});
