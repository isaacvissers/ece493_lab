import { createDecisionQueueView } from '../../src/views/decision-queue-view.js';
import { createDecisionEntryView } from '../../src/views/decision-entry-view.js';
import { createDecisionController } from '../../src/controllers/decision-controller.js';
import { decisionEligibilityService } from '../../src/services/decision-eligibility-service.js';
import { decisionService } from '../../src/services/decision-service.js';
import { assignmentStorage } from '../../src/services/assignment-storage.js';
import { auditLogService } from '../../src/services/audit-log-service.js';
import { authorNotificationService } from '../../src/services/author-notification-service.js';
import { sessionState } from '../../src/models/session-state.js';

const SUBMISSIONS_KEY = 'cms.submitted_reviews';

function seedSubmittedReviews(paperId, count, summaries = []) {
  const submissions = Array.from({ length: count }, (_, index) => ({
    paperId,
    reviewerEmail: `rev_${index + 1}@example.com`,
    status: 'submitted',
    content: { summary: summaries[index] || `Review ${index + 1}` },
  }));
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions));
}

function setupDecisionEntry(paperId) {
  const view = createDecisionEntryView();
  document.body.appendChild(view.element);
  const controller = createDecisionController({
    view,
    paperId,
    sessionState,
    decisionEligibilityService,
    decisionService,
    assignmentStorage,
    auditLogService,
    authorNotificationService,
  });
  controller.init();
  return view;
}

beforeEach(() => {
  assignmentStorage.reset();
  decisionService.reset();
  auditLogService.reset();
  authorNotificationService.reset();
  sessionState.clear();
  localStorage.removeItem(SUBMISSIONS_KEY);
  document.body.innerHTML = '';
});

test('AT-UC24-01: eligible paper appears in decision queue list', () => {
  assignmentStorage.seedPaper({ id: 'paper_1', title: 'Eligible Paper', status: 'Submitted' });
  seedSubmittedReviews('paper_1', 3);

  const view = createDecisionQueueView();
  document.body.appendChild(view.element);

  const papers = assignmentStorage.getPapers();
  const eligible = decisionEligibilityService.getEligiblePapers(papers);
  const queueItems = eligible.map((paper) => ({
    paper,
    reviewCount: decisionEligibilityService.getReviewCount(paper.id),
  }));
  view.setPapers(queueItems);

  expect(view.element.querySelector('#decision-queue-list').textContent).toContain('Eligible Paper');
  expect(view.element.querySelector('#decision-queue-list').textContent).toContain('3 reviews');
});

test('AT-UC24-02: editor can view the 3 completed reviews for eligible paper', () => {
  assignmentStorage.seedPaper({ id: 'paper_2', title: 'Review Paper', status: 'Submitted' });
  seedSubmittedReviews('paper_2', 3, ['Alpha', 'Beta', 'Gamma']);
  sessionState.authenticate({ id: 'editor_1', email: 'editor@example.com', role: 'Editor' });

  const view = setupDecisionEntry('paper_2');
  const reviewText = view.element.querySelector('#decision-reviews').textContent;

  expect(reviewText).toContain('Alpha');
  expect(reviewText).toContain('Beta');
  expect(reviewText).toContain('Gamma');
});

test('AT-UC24-03: editor records an Accept decision successfully', () => {
  assignmentStorage.seedPaper({ id: 'paper_3', title: 'Accept Paper', status: 'Submitted', editorId: 'editor_1' });
  seedSubmittedReviews('paper_3', 3);
  sessionState.authenticate({ id: 'editor_1', email: 'editor@example.com', role: 'Editor' });

  const view = setupDecisionEntry('paper_3');
  view.element.querySelector('#decision-accept').checked = true;
  view.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

  expect(view.element.querySelector('#decision-banner').textContent).toContain('Decision saved');
  const decision = decisionService.getDecisionForPaper('paper_3');
  expect(decision && decision.value).toBe('accept');
  expect(assignmentStorage.getPaper('paper_3').status).toBe('accepted');
});

test('AT-UC24-04: editor records a Reject decision successfully', () => {
  assignmentStorage.seedPaper({ id: 'paper_4', title: 'Reject Paper', status: 'Submitted', editorId: 'editor_1' });
  seedSubmittedReviews('paper_4', 3);
  sessionState.authenticate({ id: 'editor_1', email: 'editor@example.com', role: 'Editor' });

  const view = setupDecisionEntry('paper_4');
  view.element.querySelector('#decision-reject').checked = true;
  view.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

  expect(view.element.querySelector('#decision-banner').textContent).toContain('Decision saved');
  const decision = decisionService.getDecisionForPaper('paper_4');
  expect(decision && decision.value).toBe('reject');
  expect(assignmentStorage.getPaper('paper_4').status).toBe('rejected');
});

test('AT-UC24-05: fewer than 3 reviews cannot be decided', () => {
  assignmentStorage.seedPaper({ id: 'paper_5', title: 'Short Paper', status: 'Submitted' });
  seedSubmittedReviews('paper_5', 2);
  sessionState.authenticate({ id: 'editor_1', email: 'editor@example.com', role: 'Editor' });

  const view = setupDecisionEntry('paper_5');
  expect(view.element.querySelector('#decision-banner').textContent).toContain('Current: 2');
  expect(view.element.querySelector('#decision-submit').disabled).toBe(true);
});

test('AT-UC24-06: more than 3 reviews blocks decision until corrected', () => {
  assignmentStorage.seedPaper({ id: 'paper_6', title: 'Over Paper', status: 'Submitted' });
  seedSubmittedReviews('paper_6', 4);
  sessionState.authenticate({ id: 'editor_1', email: 'editor@example.com', role: 'Editor' });

  const view = setupDecisionEntry('paper_6');
  expect(view.element.querySelector('#decision-banner').textContent).toContain('Current: 4');
  expect(view.element.querySelector('#decision-submit').disabled).toBe(true);
});

test('AT-UC24-07: unauthorized editor cannot make a decision', () => {
  assignmentStorage.seedPaper({ id: 'paper_7', title: 'Protected Paper', status: 'Submitted', editorId: 'editor_1' });
  seedSubmittedReviews('paper_7', 3);
  sessionState.authenticate({ id: 'editor_2', email: 'other@example.com', role: 'Editor' });

  const view = setupDecisionEntry('paper_7');
  view.element.querySelector('#decision-accept').checked = true;
  view.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

  expect(view.element.querySelector('#decision-banner').textContent).toContain('Decision could not be saved');
  expect(auditLogService.getLogs().some((entry) => entry.eventType === 'auth_failed')).toBe(true);
});

test('AT-UC24-08: missing decision selection blocks submission', () => {
  assignmentStorage.seedPaper({ id: 'paper_8', title: 'Missing Selection', status: 'Submitted' });
  seedSubmittedReviews('paper_8', 3);
  sessionState.authenticate({ id: 'editor_1', email: 'editor@example.com', role: 'Editor' });

  const view = setupDecisionEntry('paper_8');
  view.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

  expect(view.element.querySelector('#decision-banner').textContent).toContain('Please select accept or reject');
});

test('AT-UC24-09: save failure does not persist decision', () => {
  assignmentStorage.seedPaper({ id: 'paper_9', title: 'Save Failure', status: 'Submitted' });
  seedSubmittedReviews('paper_9', 3);
  sessionState.authenticate({ id: 'editor_1', email: 'editor@example.com', role: 'Editor' });
  assignmentStorage.setFailureMode(true);

  const view = setupDecisionEntry('paper_9');
  view.element.querySelector('#decision-accept').checked = true;
  view.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

  expect(view.element.querySelector('#decision-banner').textContent).toContain('Decision could not be saved');
  expect(decisionService.getDecisionForPaper('paper_9')).toBeNull();
});

test('AT-UC24-10: notification failure does not roll back saved decision', () => {
  assignmentStorage.seedPaper({ id: 'paper_10', title: 'Notify Failure', status: 'Submitted' });
  seedSubmittedReviews('paper_10', 3);
  sessionState.authenticate({ id: 'editor_1', email: 'editor@example.com', role: 'Editor' });
  authorNotificationService.setFailureMode(true);

  const view = setupDecisionEntry('paper_10');
  view.element.querySelector('#decision-accept').checked = true;
  view.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

  expect(view.element.querySelector('#decision-banner').textContent).toContain('Decision saved');
  expect(decisionService.getDecisionForPaper('paper_10')).not.toBeNull();
});
