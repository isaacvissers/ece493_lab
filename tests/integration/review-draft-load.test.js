import { createReviewFormView } from '../../src/views/review-form-view.js';
import { createReviewFormController } from '../../src/controllers/review-form-controller.js';
import { reviewFormStore } from '../../src/services/review-form-store.js';
import { reviewDraftStore } from '../../src/services/review-draft-store.js';
import { assignmentStore } from '../../src/services/assignment-store.js';
import { sessionState } from '../../src/models/session-state.js';
import { createAssignment } from '../../src/models/assignment.js';
import { createReviewForm } from '../../src/models/review-form.js';
import { createReviewDraft } from '../../src/models/review-draft.js';

beforeEach(() => {
  assignmentStore.reset();
  reviewFormStore.reset();
  reviewDraftStore.reset();
  sessionState.clear();
  document.body.innerHTML = '';
});

test('loads draft content into review form', () => {
  assignmentStore.addAssignment(createAssignment({ paperId: 'paper_1', reviewerEmail: 'rev@example.com', status: 'accepted' }));
  reviewFormStore.saveForm(createReviewForm({ paperId: 'paper_1', status: 'active' }));
  reviewDraftStore.saveDraft(createReviewDraft({ paperId: 'paper_1', reviewerEmail: 'rev@example.com', content: { text: 'Draft content' } }));
  sessionState.authenticate({ id: 'acct_1', email: 'rev@example.com', role: 'Reviewer' });

  const view = createReviewFormView();
  document.body.appendChild(view.element);
  const controller = createReviewFormController({ view, sessionState, paperId: 'paper_1' });
  controller.init();

  expect(view.element.querySelector('#review-content').value).toBe('Draft content');
});
