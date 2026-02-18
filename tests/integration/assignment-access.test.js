import { createReviewerPaperView } from '../../src/views/reviewer-paper-view.js';
import { createReviewerPaperController } from '../../src/controllers/reviewer-paper-controller.js';
import { assignmentStore } from '../../src/services/assignment-store.js';
import { assignmentStorage } from '../../src/services/assignment-storage.js';
import { submissionStorage } from '../../src/services/submission-storage.js';
import { sessionState } from '../../src/models/session-state.js';
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
  document.body.innerHTML = '';
});

test('allows access to accepted assignment', () => {
  assignmentStorage.seedPaper({ id: 'paper_access', title: 'Access', status: 'available' });
  seedManuscript('paper_access', 'Access');
  assignmentStore.addAssignment(createAssignment({
    paperId: 'paper_access',
    reviewerEmail: 'reviewer@example.com',
    status: 'accepted',
  }));
  sessionState.authenticate({ id: 'acct_1', email: 'reviewer@example.com', role: 'Reviewer' });
  const view = createReviewerPaperView();
  document.body.appendChild(view.element);
  const controller = createReviewerPaperController({ view, sessionState, paperId: 'paper_access' });
  controller.init();
  expect(view.element.querySelector('#paper-detail').textContent).toContain('Access');
});

test('denies access without accepted assignment', () => {
  assignmentStorage.seedPaper({ id: 'paper_denied', title: 'Denied', status: 'available' });
  seedManuscript('paper_denied', 'Denied');
  sessionState.authenticate({ id: 'acct_1', email: 'reviewer@example.com', role: 'Reviewer' });
  const view = createReviewerPaperView();
  document.body.appendChild(view.element);
  const controller = createReviewerPaperController({ view, sessionState, paperId: 'paper_denied' });
  controller.init();
  expect(view.element.querySelector('#paper-banner').textContent).toContain('Access denied');
});
