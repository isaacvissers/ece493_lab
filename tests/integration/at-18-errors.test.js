import { createReviewerAssignmentsView } from '../../src/views/reviewer-assignments-view.js';
import { createReviewerAssignmentsController } from '../../src/controllers/reviewer-assignments-controller.js';
import { createReviewerPaperView } from '../../src/views/reviewer-paper-view.js';
import { createReviewerPaperController } from '../../src/controllers/reviewer-paper-controller.js';
import { assignmentStore } from '../../src/services/assignment-store.js';
import { assignmentStorage } from '../../src/services/assignment-storage.js';
import { submissionStorage } from '../../src/services/submission-storage.js';
import { sessionState } from '../../src/models/session-state.js';
import { authController } from '../../src/controllers/auth-controller.js';
import { createAssignment } from '../../src/models/assignment.js';
import { createManuscript } from '../../src/models/manuscript.js';

function seedManuscript(id, title) {
  const manuscript = createManuscript({
    title,
    authorNames: 'A',
    affiliations: 'B',
    contactEmail: 'a@example.com',
    abstract: 'Abstract',
    keywords: 'key',
    mainSource: 'upload',
  }, { originalName: `${id}.pdf` }, 'author@example.com');
  manuscript.id = id;
  submissionStorage.saveSubmission(manuscript);
}

beforeEach(() => {
  assignmentStore.reset();
  assignmentStorage.reset();
  submissionStorage.reset();
  sessionState.clear();
  authController.clearPending();
  document.body.innerHTML = '';
});

test('AT-UC18-05: retrieval failure shows error message', () => {
  sessionState.authenticate({ id: 'acct_1', email: 'reviewer@example.com', role: 'Reviewer' });
  assignmentStore.setLookupFailureMode(true);
  const view = createReviewerAssignmentsView();
  document.body.appendChild(view.element);
  const controller = createReviewerAssignmentsController({ view, sessionState });
  controller.init();
  expect(view.element.querySelector('#assignments-banner').textContent).toContain('could not be loaded');
});

test('AT-UC18-06: unavailable manuscript blocks access', () => {
  assignmentStorage.seedPaper({ id: 'paper_removed', title: 'Removed', status: 'removed' });
  seedManuscript('paper_removed', 'Removed');
  assignmentStore.addAssignment(createAssignment({
    paperId: 'paper_removed',
    reviewerEmail: 'reviewer@example.com',
    status: 'accepted',
  }));
  sessionState.authenticate({ id: 'acct_1', email: 'reviewer@example.com', role: 'Reviewer' });
  const view = createReviewerPaperView();
  document.body.appendChild(view.element);
  const controller = createReviewerPaperController({ view, sessionState, paperId: 'paper_removed' });
  controller.init();
  expect(view.element.querySelector('#paper-banner').textContent).toContain('unavailable');
});

test('AT-UC18-07: acceptance not recorded shows guidance', () => {
  sessionState.authenticate({ id: 'acct_1', email: 'reviewer@example.com', role: 'Reviewer' });
  const view = createReviewerAssignmentsView();
  document.body.appendChild(view.element);
  const controller = createReviewerAssignmentsController({ view, sessionState });
  controller.init();
  expect(view.element.querySelector('#assignments-list').textContent).toContain('No accepted assignments');
});

test('AT-UC18-08: unauthenticated reviewer is prompted to log in', () => {
  const view = createReviewerAssignmentsView();
  document.body.appendChild(view.element);
  const controller = createReviewerAssignmentsController({ view, sessionState });
  controller.init();
  expect(view.element.querySelector('#assignments-banner').textContent).toContain('log in');
  expect(authController.getPending()).toEqual({ destination: 'reviewer-assignments', payload: undefined });
});
