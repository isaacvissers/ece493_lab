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

test('rolls back decision when paper update fails', () => {
  assignmentStorage.seedPaper({ id: 'paper_fail', title: 'Paper', status: 'submitted', editorId: 'editor_1' });
  seedReviews('paper_fail', 3);

  assignmentStorage.setFailureMode(true);
  const result = decisionService.saveDecision({
    paperId: 'paper_fail',
    editorId: 'editor_1',
    value: 'accept',
    eligibilityService: decisionEligibilityService,
    assignmentStorage,
    auditLogService,
    authorNotificationService,
  });
  assignmentStorage.setFailureMode(false);

  expect(result.ok).toBe(false);
  expect(result.reason).toBe('paper_update_failed');
  expect(decisionService.getDecisionForPaper('paper_fail')).toBeNull();
  const paper = assignmentStorage.getPaper('paper_fail');
  expect(paper.status).toBe('submitted');
});

test('rolls back decision when paper update fails without audit log', () => {
  assignmentStorage.seedPaper({ id: 'paper_fail_no_log', title: 'Paper', status: 'submitted', editorId: 'editor_1' });
  seedReviews('paper_fail_no_log', 3);

  assignmentStorage.setFailureMode(true);
  const result = decisionService.saveDecision({
    paperId: 'paper_fail_no_log',
    editorId: 'editor_1',
    value: 'accept',
    eligibilityService: decisionEligibilityService,
    assignmentStorage,
    auditLogService: null,
    authorNotificationService,
  });
  assignmentStorage.setFailureMode(false);

  expect(result.ok).toBe(false);
  expect(result.reason).toBe('paper_update_failed');
});
