import { createReviewReadinessView } from '../../src/views/review-readiness-view.js';
import { createReviewReadinessController } from '../../src/controllers/review-readiness-controller.js';
import { createRefereeAssignmentView } from '../../src/views/referee-assignment-view.js';
import { createRefereeAssignmentController } from '../../src/controllers/referee-assignment-controller.js';
import { createRefereeGuidanceView } from '../../src/views/referee-guidance-view.js';
import { assignmentStorage } from '../../src/services/assignment-storage.js';
import { reviewRequestStore } from '../../src/services/review-request-store.js';
import { sessionState } from '../../src/models/session-state.js';
import { createReviewRequest } from '../../src/models/review_request.js';
import { errorLog } from '../../src/services/error-log.js';

function seedEditor() {
  sessionState.authenticate({ id: 'acct_1', email: 'editor@example.com', role: 'Editor' });
}

function setupReadiness(paperId, withGuidance = false) {
  const view = createReviewReadinessView();
  document.body.appendChild(view.element);
  let guidanceView = null;
  if (withGuidance) {
    guidanceView = createRefereeGuidanceView();
    document.body.appendChild(guidanceView.element);
  }
  const controller = createReviewReadinessController({
    view,
    guidanceView,
    assignmentStorage,
    reviewRequestStore,
    sessionState,
    paperId,
  });
  controller.init();
  return { view, guidanceView, controller };
}

function setupAssignment(paperId) {
  const view = createRefereeAssignmentView();
  document.body.appendChild(view.element);
  const controller = createRefereeAssignmentController({
    view,
    assignmentStorage,
    reviewRequestStore,
    sessionState,
    paperId,
  });
  controller.init();
  return { view, controller };
}

beforeEach(() => {
  assignmentStorage.reset();
  reviewRequestStore.reset();
  errorLog.clear();
  sessionState.clear();
  document.body.innerHTML = '';
});

test('AT-UC17-01: allows readiness with exactly three referees', () => {
  assignmentStorage.seedPaper({
    id: 'paper_ready',
    title: 'Ready Paper',
    status: 'Eligible',
    assignedRefereeEmails: ['r1@example.com', 'r2@example.com', 'r3@example.com'],
  });
  seedEditor();
  const { view, controller } = setupReadiness('paper_ready');
  const result = controller.evaluateReadiness();
  expect(result.ready).toBe(true);
  expect(view.element.querySelector('#readiness-banner').textContent).toContain('ready');
  expect(view.element.querySelector('#readiness-count').textContent).toContain('3');
});

test('AT-UC17-02: blocks when fewer than three and shows add guidance', () => {
  assignmentStorage.seedPaper({
    id: 'paper_low',
    title: 'Low Paper',
    status: 'Eligible',
    assignedRefereeEmails: ['r1@example.com', 'r2@example.com'],
  });
  seedEditor();
  const { view, guidanceView, controller } = setupReadiness('paper_low', true);
  const result = controller.evaluateReadiness();
  expect(result.ready).toBe(false);
  expect(view.element.querySelector('#readiness-banner').textContent).toContain('blocked');
  expect(view.element.querySelector('#readiness-count').textContent).toContain('2');
  expect(guidanceView.element.querySelector('#guidance-message').textContent).toContain('Add');
  expect(guidanceView.element.querySelector('#guidance-action').textContent).toContain('Add');
});

test('AT-UC17-03: blocks when more than three and shows remove guidance', () => {
  assignmentStorage.seedPaper({
    id: 'paper_high',
    title: 'High Paper',
    status: 'Eligible',
    assignedRefereeEmails: ['r1@example.com', 'r2@example.com', 'r3@example.com', 'r4@example.com'],
  });
  seedEditor();
  const { view, guidanceView, controller } = setupReadiness('paper_high', true);
  const result = controller.evaluateReadiness();
  expect(result.ready).toBe(false);
  expect(view.element.querySelector('#readiness-banner').textContent).toContain('blocked');
  expect(view.element.querySelector('#readiness-count').textContent).toContain('4');
  expect(guidanceView.element.querySelector('#guidance-message').textContent).toContain('Remove');
  expect(guidanceView.element.querySelector('#guidance-action').textContent).toContain('Remove');
});

test('AT-UC17-04: lookup failure blocks readiness and logs failure', () => {
  assignmentStorage.seedPaper({
    id: 'paper_fail',
    title: 'Failure Paper',
    status: 'Eligible',
    assignedRefereeEmails: ['r1@example.com', 'r2@example.com'],
  });
  reviewRequestStore.setLookupFailureMode(true);
  seedEditor();
  const { view, controller } = setupReadiness('paper_fail');
  const result = controller.evaluateReadiness();
  expect(result.ok).toBe(false);
  expect(view.element.querySelector('#readiness-banner').textContent)
    .toContain('Unable to determine referee count');
  expect(errorLog.getFailures().length).toBeGreaterThan(0);
});

test('AT-UC17-05: flags missing invitations when any referee lacks an invite', () => {
  assignmentStorage.seedPaper({
    id: 'paper_missing',
    title: 'Missing Invites',
    status: 'Eligible',
    assignedRefereeEmails: ['r1@example.com', 'r2@example.com', 'r3@example.com'],
  });
  reviewRequestStore.addRequest(createReviewRequest({
    assignmentId: 'asg_1',
    paperId: 'paper_missing',
    reviewerEmail: 'r1@example.com',
    status: 'sent',
  }));
  reviewRequestStore.addRequest(createReviewRequest({
    assignmentId: 'asg_2',
    paperId: 'paper_missing',
    reviewerEmail: 'r2@example.com',
    status: 'sent',
  }));
  seedEditor();
  const { view, controller } = setupReadiness('paper_missing');
  const result = controller.evaluateReadiness();
  expect(result.missingInvitations).toContain('r3@example.com');
  expect(view.element.querySelector('#missing-invitations').textContent).toContain('r3@example.com');
});

test('AT-UC17-06: editor cannot assign a fourth referee', () => {
  assignmentStorage.seedPaper({
    id: 'paper_full',
    title: 'Full Paper',
    status: 'Eligible',
    assignedRefereeEmails: ['r1@example.com', 'r2@example.com', 'r3@example.com'],
  });
  seedEditor();
  const { view } = setupAssignment('paper_full');
  view.element.querySelector('#referee-email-1').value = 'r4@example.com';
  view.element.querySelector('form')
    .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  const summaryText = view.element.querySelector('#assignment-summary').textContent;
  expect(summaryText).toContain('Blocked');
  expect(summaryText).toContain('three referees');
});

test('AT-UC17-07: adding missing referee enables readiness', () => {
  assignmentStorage.seedPaper({
    id: 'paper_recover',
    title: 'Recover Paper',
    status: 'Eligible',
    assignedRefereeEmails: ['r1@example.com', 'r2@example.com'],
  });
  seedEditor();
  const { view: assignView } = setupAssignment('paper_recover');
  assignView.element.querySelector('#referee-email-1').value = 'r3@example.com';
  assignView.element.querySelector('form')
    .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

  document.body.innerHTML = '';
  const { controller: readinessController, view: readinessView } = setupReadiness('paper_recover');
  const result = readinessController.evaluateReadiness();
  expect(result.ready).toBe(true);
  expect(readinessView.element.querySelector('#readiness-banner').textContent).toContain('ready');
});
