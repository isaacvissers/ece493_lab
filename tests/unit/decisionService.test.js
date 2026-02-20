import { decisionService } from '../../src/services/decisionService.js';
import { decisionEligibilityService } from '../../src/services/decisionEligibilityService.js';
import { assignmentStorage } from '../../src/services/assignment-storage.js';
import { auditLogService } from '../../src/services/audit-log-service.js';
import { authorNotificationService } from '../../src/services/authorNotificationService.js';

function seedReviews(paperId, count = 3) {
  const entries = Array.from({ length: count }, (_, index) => ({
    paperId,
    status: 'submitted',
    content: { summary: `Review ${index + 1}` },
  }));
  localStorage.setItem('cms.submitted_reviews', JSON.stringify(entries));
}

beforeEach(() => {
  decisionService.reset();
  assignmentStorage.reset();
  auditLogService.reset();
  authorNotificationService.reset();
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('cms.submitted_reviews');
  }
});

test('saves a decision and updates paper status', () => {
  assignmentStorage.seedPaper({ id: 'paper_accept', title: 'Paper', status: 'submitted', editorId: 'editor_1' });
  seedReviews('paper_accept', 3);

  const result = decisionService.saveDecision({
    paperId: 'paper_accept',
    editorId: 'editor_1',
    value: 'accept',
    comments: 'Looks good',
    eligibilityService: decisionEligibilityService,
    assignmentStorage,
    auditLogService,
    authorNotificationService,
  });

  expect(result.ok).toBe(true);
  const decision = decisionService.getDecisionForPaper('paper_accept');
  expect(decision).not.toBeNull();
  expect(decision.value).toBe('accept');

  const updated = assignmentStorage.getPaper('paper_accept');
  expect(updated.status).toBe('accepted');
});

test('blocks duplicate decisions for the same paper', () => {
  assignmentStorage.seedPaper({ id: 'paper_dupe', title: 'Paper', status: 'submitted', editorId: 'editor_1' });
  seedReviews('paper_dupe', 3);

  const first = decisionService.saveDecision({
    paperId: 'paper_dupe',
    editorId: 'editor_1',
    value: 'accept',
    eligibilityService: decisionEligibilityService,
    assignmentStorage,
    auditLogService,
    authorNotificationService,
  });
  expect(first.ok).toBe(true);

  const second = decisionService.saveDecision({
    paperId: 'paper_dupe',
    editorId: 'editor_1',
    value: 'reject',
    eligibilityService: decisionEligibilityService,
    assignmentStorage,
    auditLogService,
    authorNotificationService,
  });

  expect(second.ok).toBe(false);
  expect(second.reason).toBe('decision_exists');
});

test('rejects decision when review count is not exactly three', () => {
  assignmentStorage.seedPaper({ id: 'paper_reviews', title: 'Paper', status: 'submitted', editorId: 'editor_1' });
  seedReviews('paper_reviews', 2);

  const result = decisionService.saveDecision({
    paperId: 'paper_reviews',
    editorId: 'editor_1',
    value: 'accept',
    eligibilityService: decisionEligibilityService,
    assignmentStorage,
    auditLogService,
    authorNotificationService,
  });

  expect(result.ok).toBe(false);
  expect(result.reason).toBe('review_count_invalid');
  expect(result.reviewCount).toBe(2);
});

test('returns null when paper id is missing', () => {
  expect(decisionService.getDecisionForPaper()).toBeNull();
});

test('rejects decision for unknown paper', () => {
  seedReviews('paper_missing', 3);
  const result = decisionService.saveDecision({
    paperId: 'paper_missing',
    editorId: 'editor_1',
    value: 'accept',
    eligibilityService: decisionEligibilityService,
    assignmentStorage,
    auditLogService,
    authorNotificationService,
  });

  expect(result.ok).toBe(false);
  expect(result.reason).toBe('paper_not_found');
});

test('rejects decision for unauthorized editor', () => {
  assignmentStorage.seedPaper({ id: 'paper_auth', title: 'Paper', status: 'submitted', editorId: 'editor_1' });
  seedReviews('paper_auth', 3);

  const result = decisionService.saveDecision({
    paperId: 'paper_auth',
    editorId: 'editor_2',
    value: 'accept',
    eligibilityService: decisionEligibilityService,
    assignmentStorage,
    auditLogService,
    authorNotificationService,
  });

  expect(result.ok).toBe(false);
  expect(result.reason).toBe('unauthorized');
});

test('rejects unauthorized editor without audit log', () => {
  assignmentStorage.seedPaper({ id: 'paper_no_log', title: 'Paper', status: 'submitted', editorId: 'editor_1' });
  seedReviews('paper_no_log', 3);

  const result = decisionService.saveDecision({
    paperId: 'paper_no_log',
    editorId: 'editor_2',
    value: 'accept',
    eligibilityService: decisionEligibilityService,
    assignmentStorage,
    auditLogService: null,
    authorNotificationService,
  });

  expect(result.ok).toBe(false);
  expect(result.reason).toBe('unauthorized');
});

test('rejects invalid decision value', () => {
  assignmentStorage.seedPaper({ id: 'paper_value', title: 'Paper', status: 'submitted', editorId: 'editor_1' });
  seedReviews('paper_value', 3);

  const result = decisionService.saveDecision({
    paperId: 'paper_value',
    editorId: 'editor_1',
    value: 'maybe',
    eligibilityService: decisionEligibilityService,
    assignmentStorage,
    auditLogService,
    authorNotificationService,
  });

  expect(result.ok).toBe(false);
  expect(result.reason).toBe('invalid_value');
});

test('rejects empty decision value', () => {
  assignmentStorage.seedPaper({ id: 'paper_empty', title: 'Paper', status: 'submitted', editorId: 'editor_1' });
  seedReviews('paper_empty', 3);

  const result = decisionService.saveDecision({
    paperId: 'paper_empty',
    editorId: 'editor_1',
    value: '',
    eligibilityService: decisionEligibilityService,
    assignmentStorage,
    auditLogService,
    authorNotificationService,
  });

  expect(result.ok).toBe(false);
  expect(result.reason).toBe('invalid_value');
});

test('does not roll back decision when notification fails', () => {
  assignmentStorage.seedPaper({ id: 'paper_notice', title: 'Paper', status: 'submitted', editorId: 'editor_1' });
  seedReviews('paper_notice', 3);
  authorNotificationService.setFailureMode(true);

  const result = decisionService.saveDecision({
    paperId: 'paper_notice',
    editorId: 'editor_1',
    value: 'accept',
    eligibilityService: decisionEligibilityService,
    assignmentStorage,
    auditLogService,
    authorNotificationService,
  });
  authorNotificationService.setFailureMode(false);

  expect(result.ok).toBe(true);
  expect(decisionService.getDecisionForPaper('paper_notice')).not.toBeNull();
  const paper = assignmentStorage.getPaper('paper_notice');
  expect(paper.status).toBe('accepted');
});

test('uses cached decisions when available', () => {
  assignmentStorage.seedPaper({ id: 'paper_cache', title: 'Paper', status: 'submitted', editorId: 'editor_1' });
  seedReviews('paper_cache', 3);

  decisionService.saveDecision({
    paperId: 'paper_cache',
    editorId: 'editor_1',
    value: 'accept',
    eligibilityService: decisionEligibilityService,
    assignmentStorage,
    auditLogService,
    authorNotificationService,
  });

  const first = decisionService.getDecisionForPaper('paper_cache');
  const second = decisionService.getDecisionForPaper('paper_cache');
  expect(first).not.toBeNull();
  expect(second).not.toBeNull();
});

test('saves decisions without optional loggers', () => {
  assignmentStorage.seedPaper({ id: 'paper_optional', title: 'Paper', status: 'submitted', editorId: 'editor_1' });
  seedReviews('paper_optional', 3);

  const result = decisionService.saveDecision({
    paperId: 'paper_optional',
    editorId: 'editor_1',
    value: 'accept',
    eligibilityService: decisionEligibilityService,
    assignmentStorage,
    auditLogService: null,
    authorNotificationService: null,
  });

  expect(result.ok).toBe(true);
});

test('loads decisions from localStorage when present', () => {
  decisionService.reset();
  localStorage.setItem('cms.decisions', JSON.stringify([
    { decisionId: 'decision_local', paperId: 'paper_local', value: 'accept' },
  ]));

  const decision = decisionService.getDecisionForPaper('paper_local');
  expect(decision).not.toBeNull();
});

test('uses default services when dependencies are omitted', () => {
  assignmentStorage.seedPaper({ id: 'paper_defaults', title: 'Paper', status: 'submitted', editorId: 'editor_1' });
  seedReviews('paper_defaults', 3);

  const result = decisionService.saveDecision({
    paperId: 'paper_defaults',
    editorId: 'editor_1',
    value: 'accept',
  });

  expect(result.ok).toBe(true);
});

test('returns error when saveDecision is called without input', () => {
  const result = decisionService.saveDecision();
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('paper_not_found');
});
