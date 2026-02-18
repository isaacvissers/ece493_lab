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

test('AT-UC20-01: open form for accepted assignment', () => {
  assignmentStore.addAssignment(createAssignment({ paperId: 'paper_1', reviewerEmail: 'rev@example.com', status: 'accepted' }));
  reviewFormStore.saveForm(createReviewForm({ paperId: 'paper_1', status: 'active' }));
  sessionState.authenticate({ id: 'acct_1', email: 'rev@example.com', role: 'Reviewer' });

  const view = createReviewFormView();
  document.body.appendChild(view.element);
  const controller = createReviewFormController({ view, sessionState, paperId: 'paper_1' });
  controller.init();

  expect(view.element.querySelector('#review-form-banner').textContent).toContain('loaded');
});

test('AT-UC20-02: load draft when present', () => {
  assignmentStore.addAssignment(createAssignment({ paperId: 'paper_2', reviewerEmail: 'rev@example.com', status: 'accepted' }));
  reviewFormStore.saveForm(createReviewForm({ paperId: 'paper_2', status: 'active' }));
  reviewDraftStore.saveDraft(createReviewDraft({ paperId: 'paper_2', reviewerEmail: 'rev@example.com', content: { text: 'Draft' } }));
  sessionState.authenticate({ id: 'acct_1', email: 'rev@example.com', role: 'Reviewer' });

  const view = createReviewFormView();
  document.body.appendChild(view.element);
  const controller = createReviewFormController({ view, sessionState, paperId: 'paper_2' });
  controller.init();

  expect(view.element.querySelector('#review-content').value).toBe('Draft');
});

test('AT-UC20-03: deny unassigned access', () => {
  reviewFormStore.saveForm(createReviewForm({ paperId: 'paper_3', status: 'active' }));
  sessionState.authenticate({ id: 'acct_1', email: 'rev@example.com', role: 'Reviewer' });

  const view = createReviewFormView();
  document.body.appendChild(view.element);
  const controller = createReviewFormController({ view, sessionState, paperId: 'paper_3' });
  controller.init();

  expect(view.element.querySelector('#review-form-banner').textContent).toContain('not authorized');
});

test('AT-UC20-04: deny pending/rejected access', () => {
  assignmentStore.addAssignment(createAssignment({ paperId: 'paper_4', reviewerEmail: 'rev@example.com', status: 'pending' }));
  reviewFormStore.saveForm(createReviewForm({ paperId: 'paper_4', status: 'active' }));
  sessionState.authenticate({ id: 'acct_1', email: 'rev@example.com', role: 'Reviewer' });

  const view = createReviewFormView();
  document.body.appendChild(view.element);
  const controller = createReviewFormController({ view, sessionState, paperId: 'paper_4' });
  controller.init();

  expect(view.element.querySelector('#review-form-banner').textContent).toContain('accepted');
});

test('AT-UC20-05: closed period is view-only', () => {
  assignmentStore.addAssignment(createAssignment({ paperId: 'paper_5', reviewerEmail: 'rev@example.com', status: 'accepted' }));
  reviewFormStore.saveForm(createReviewForm({ paperId: 'paper_5', status: 'closed' }));
  sessionState.authenticate({ id: 'acct_1', email: 'rev@example.com', role: 'Reviewer' });

  const view = createReviewFormView();
  document.body.appendChild(view.element);
  const controller = createReviewFormController({ view, sessionState, paperId: 'paper_5' });
  controller.init();

  expect(view.element.querySelector('#review-content').disabled).toBe(true);
});
