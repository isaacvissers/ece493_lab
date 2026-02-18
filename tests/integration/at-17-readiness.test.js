import { createReviewReadinessView } from '../../src/views/review-readiness-view.js';
import { createReviewReadinessController } from '../../src/controllers/review-readiness-controller.js';
import { createRefereeAssignmentView } from '../../src/views/referee-assignment-view.js';
import { createRefereeAssignmentController } from '../../src/controllers/referee-assignment-controller.js';
import { assignmentStorage } from '../../src/services/assignment-storage.js';
import { reviewRequestStore } from '../../src/services/review-request-store.js';
import { sessionState } from '../../src/models/session-state.js';
import { createReviewRequest } from '../../src/models/review_request.js';

function setupReadiness(paperId) {
  const view = createReviewReadinessView();
  document.body.appendChild(view.element);
  const controller = createReviewReadinessController({
    view,
    assignmentStorage,
    reviewRequestStore,
    sessionState,
    paperId,
  });
  controller.init();
  return { view, controller };
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
  return { view };
}

function seedEditor() {
  sessionState.authenticate({ id: 'acct_1', email: 'editor@example.com', role: 'Editor' });
}

beforeEach(() => {
  assignmentStorage.reset();
  reviewRequestStore.reset();
  sessionState.clear();
  document.body.innerHTML = '';
});

test('AT-UC17-01: allows readiness with exactly three non-declined assignments', () => {
  assignmentStorage.seedPaper({
    id: 'paper_ready',
    title: 'Ready Paper',
    status: 'Eligible',
    assignedRefereeEmails: ['a@example.com', 'b@example.com', 'c@example.com'],
  });
  seedEditor();
  const { view, controller } = setupReadiness('paper_ready');
  const result = controller.evaluateReadiness();
  expect(result.ready).toBe(true);
  expect(view.element.querySelector('#readiness-banner').textContent).toContain('ready');
  expect(view.element.querySelector('#readiness-count').textContent).toContain('3');
});

test('AT-UC17-02: blocks readiness with fewer than three and shows count', () => {
  assignmentStorage.seedPaper({
    id: 'paper_short',
    title: 'Short Paper',
    status: 'Eligible',
    assignedRefereeEmails: ['a@example.com', 'b@example.com'],
  });
  seedEditor();
  const { view, controller } = setupReadiness('paper_short');
  const result = controller.evaluateReadiness();
  expect(result.ready).toBe(false);
  expect(view.element.querySelector('#readiness-banner').textContent).toContain('blocked');
  expect(view.element.querySelector('#readiness-count').textContent).toContain('2');
});

test('AT-UC17-03: blocks readiness with more than three and shows count', () => {
  assignmentStorage.seedPaper({
    id: 'paper_extra',
    title: 'Extra Paper',
    status: 'Eligible',
    assignedRefereeEmails: ['a@example.com', 'b@example.com', 'c@example.com', 'd@example.com'],
  });
  seedEditor();
  const { view, controller } = setupReadiness('paper_extra');
  const result = controller.evaluateReadiness();
  expect(result.ready).toBe(false);
  expect(view.element.querySelector('#readiness-banner').textContent).toContain('blocked');
  expect(view.element.querySelector('#readiness-count').textContent).toContain('4');
});

test('AT-UC17-04: blocks fourth-assignment attempt', () => {
  assignmentStorage.seedPaper({
    id: 'paper_full',
    title: 'Full Paper',
    status: 'Eligible',
    assignedRefereeEmails: ['a@example.com', 'b@example.com', 'c@example.com'],
  });
  seedEditor();
  const { view } = setupAssignment('paper_full');
  view.element.querySelector('#referee-email-1').value = 'd@example.com';
  const event = new Event('submit', { bubbles: true, cancelable: true });
  view.element.querySelector('form').dispatchEvent(event);
  expect(view.element.querySelector('#assignment-summary').textContent).toContain('Blocked');
  expect(view.element.querySelector('#assignment-summary').textContent).toContain('policy');
});

test('AT-UC17-05: flags missing invitations when enabled', () => {
  assignmentStorage.seedPaper({
    id: 'paper_missing',
    title: 'Missing Invites',
    status: 'Eligible',
    assignedRefereeEmails: ['a@example.com', 'b@example.com', 'c@example.com'],
  });
  reviewRequestStore.addRequest(createReviewRequest({
    assignmentId: 'asg_1',
    paperId: 'paper_missing',
    reviewerEmail: 'a@example.com',
    status: 'sent',
  }));
  reviewRequestStore.addRequest(createReviewRequest({
    assignmentId: 'asg_2',
    paperId: 'paper_missing',
    reviewerEmail: 'b@example.com',
    status: 'sent',
  }));
  seedEditor();
  const { view, controller } = setupReadiness('paper_missing');
  const result = controller.evaluateReadiness();
  expect(result.missingInvitations).toContain('c@example.com');
  expect(view.element.querySelector('#missing-invitations').textContent).toContain('c@example.com');
});
