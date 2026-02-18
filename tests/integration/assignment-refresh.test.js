import { createReviewerAssignmentsView } from '../../src/views/reviewer-assignments-view.js';
import { createReviewerAssignmentsController } from '../../src/controllers/reviewer-assignments-controller.js';
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

test('refresh updates list with newly accepted assignment', () => {
  assignmentStorage.seedPaper({ id: 'paper_refresh', title: 'Refreshable', status: 'available' });
  seedManuscript('paper_refresh', 'Refreshable');
  sessionState.authenticate({ id: 'acct_1', email: 'reviewer@example.com', role: 'Reviewer' });

  const view = createReviewerAssignmentsView();
  document.body.appendChild(view.element);
  const controller = createReviewerAssignmentsController({ view, sessionState });
  controller.init();

  assignmentStore.addAssignment(createAssignment({
    paperId: 'paper_refresh',
    reviewerEmail: 'reviewer@example.com',
    status: 'accepted',
  }));

  view.element.querySelector('#assignments-refresh').click();
  expect(view.element.querySelector('#assignments-list').textContent).toContain('Refreshable');
});
