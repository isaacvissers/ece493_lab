import { reviewFormAccess } from '../../src/services/review-form-access.js';
import { reviewFormStore } from '../../src/services/review-form-store.js';
import { reviewDraftStore } from '../../src/services/review-draft-store.js';
import { assignmentStore } from '../../src/services/assignment-store.js';
import { createAssignment } from '../../src/models/assignment.js';
import { createReviewForm } from '../../src/models/review-form.js';
import { createReviewDraft } from '../../src/models/review-draft.js';

beforeEach(() => {
  assignmentStore.reset();
  reviewFormStore.reset();
  reviewDraftStore.reset();
});

test('allows accepted assignment', () => {
  assignmentStore.addAssignment(createAssignment({ paperId: 'paper_1', reviewerEmail: 'rev@example.com', status: 'accepted' }));
  reviewFormStore.saveForm(createReviewForm({ paperId: 'paper_1', status: 'active' }));
  const result = reviewFormAccess.getForm({ paperId: 'paper_1', reviewerEmail: 'rev@example.com' });
  expect(result.ok).toBe(true);
});

test('loads draft when present', () => {
  assignmentStore.addAssignment(createAssignment({ paperId: 'paper_2', reviewerEmail: 'rev@example.com', status: 'accepted' }));
  reviewFormStore.saveForm(createReviewForm({ paperId: 'paper_2', status: 'active' }));
  reviewDraftStore.saveDraft(createReviewDraft({ paperId: 'paper_2', reviewerEmail: 'rev@example.com', content: { text: 'Draft' } }));
  const result = reviewFormAccess.getForm({ paperId: 'paper_2', reviewerEmail: 'rev@example.com' });
  expect(result.ok).toBe(true);
  expect(result.draft.content.text).toBe('Draft');
});

test('blocks unassigned access', () => {
  reviewFormStore.saveForm(createReviewForm({ paperId: 'paper_3', status: 'active' }));
  const result = reviewFormAccess.getForm({ paperId: 'paper_3', reviewerEmail: 'rev@example.com' });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('not_assigned');
});

test('blocks pending/rejected access', () => {
  assignmentStore.addAssignment(createAssignment({ paperId: 'paper_4', reviewerEmail: 'rev@example.com', status: 'pending' }));
  reviewFormStore.saveForm(createReviewForm({ paperId: 'paper_4', status: 'active' }));
  const result = reviewFormAccess.getForm({ paperId: 'paper_4', reviewerEmail: 'rev@example.com' });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('not_accepted');
});

test('view-only when review period closed', () => {
  assignmentStore.addAssignment(createAssignment({ paperId: 'paper_5', reviewerEmail: 'rev@example.com', status: 'accepted' }));
  reviewFormStore.saveForm(createReviewForm({ paperId: 'paper_5', status: 'closed' }));
  const result = reviewFormAccess.getForm({ paperId: 'paper_5', reviewerEmail: 'rev@example.com' });
  expect(result.ok).toBe(true);
  expect(result.viewOnly).toBe(true);
});
