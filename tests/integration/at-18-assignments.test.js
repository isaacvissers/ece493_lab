import { createReviewerAssignmentsView } from '../../src/views/reviewer-assignments-view.js';
import { createReviewerAssignmentsController } from '../../src/controllers/reviewer-assignments-controller.js';
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

function setupAssignments() {
  const view = createReviewerAssignmentsView();
  document.body.appendChild(view.element);
  const controller = createReviewerAssignmentsController({
    view,
    sessionState,
  });
  controller.init();
  return { view, controller };
}

beforeEach(() => {
  assignmentStore.reset();
  assignmentStorage.reset();
  submissionStorage.reset();
  sessionState.clear();
  document.body.innerHTML = '';
});

test('AT-UC18-01: accepted assignment appears in list', () => {
  assignmentStorage.seedPaper({ id: 'paper_1', title: 'Accepted', status: 'available' });
  seedManuscript('paper_1', 'Accepted');
  assignmentStore.addAssignment(createAssignment({
    paperId: 'paper_1',
    reviewerEmail: 'reviewer@example.com',
    status: 'accepted',
  }));
  sessionState.authenticate({ id: 'acct_1', email: 'reviewer@example.com', role: 'Reviewer' });
  const { view } = setupAssignments();
  expect(view.element.querySelector('#assignments-list').textContent).toContain('Accepted');
});

test('AT-UC18-02: accepted assignment appears after refresh', () => {
  assignmentStorage.seedPaper({ id: 'paper_2', title: 'Refresh Paper', status: 'available' });
  seedManuscript('paper_2', 'Refresh Paper');
  sessionState.authenticate({ id: 'acct_1', email: 'reviewer@example.com', role: 'Reviewer' });
  const { view, controller } = setupAssignments();
  assignmentStore.addAssignment(createAssignment({
    paperId: 'paper_2',
    reviewerEmail: 'reviewer@example.com',
    status: 'accepted',
  }));
  controller.refresh();
  expect(view.element.querySelector('#assignments-list').textContent).toContain('Refresh Paper');
});

test('AT-UC18-03: accepted paper opens with details and manuscript link', () => {
  assignmentStorage.seedPaper({ id: 'paper_3', title: 'Detail Paper', status: 'available' });
  seedManuscript('paper_3', 'Detail Paper');
  assignmentStore.addAssignment(createAssignment({
    paperId: 'paper_3',
    reviewerEmail: 'reviewer@example.com',
    status: 'accepted',
  }));
  sessionState.authenticate({ id: 'acct_1', email: 'reviewer@example.com', role: 'Reviewer' });
  const view = createReviewerPaperView();
  document.body.appendChild(view.element);
  const controller = createReviewerPaperController({
    view,
    sessionState,
    paperId: 'paper_3',
  });
  controller.init();
  expect(view.element.querySelector('#paper-detail').textContent).toContain('Detail Paper');
  expect(view.element.querySelector('#manuscript-link').textContent).toContain('paper_3.pdf');
});

test('AT-UC18-04: unaccepted access is denied', () => {
  assignmentStorage.seedPaper({ id: 'paper_4', title: 'Denied', status: 'available' });
  seedManuscript('paper_4', 'Denied');
  sessionState.authenticate({ id: 'acct_1', email: 'reviewer@example.com', role: 'Reviewer' });
  const view = createReviewerPaperView();
  document.body.appendChild(view.element);
  const controller = createReviewerPaperController({
    view,
    sessionState,
    paperId: 'paper_4',
  });
  controller.init();
  expect(view.element.querySelector('#paper-banner').textContent).toContain('Access denied');
});
