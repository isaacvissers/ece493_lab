import { createDecisionDetailView } from '../../src/views/decision_detail_view.js';
import { createDecisionController } from '../../src/controllers/decision_controller.js';
import { decisionRepository } from '../../src/services/decision_repository.js';
import { sessionState } from '../../src/models/session-state.js';
import { auditLogService } from '../../src/services/audit_log_service.js';

beforeEach(() => {
  decisionRepository.reset();
  auditLogService.reset();
  sessionState.clear();
  document.body.innerHTML = '';
});

test('non-author access is denied and logged', () => {
  decisionRepository.seedPaper({
    paperId: 'paper_access',
    title: 'Access Paper',
    authorIds: ['author_a'],
  });
  decisionRepository.seedDecision({
    decisionId: 'decision_access',
    paperId: 'paper_access',
    value: 'accept',
  });
  sessionState.authenticate({ id: 'author_b', email: 'other@example.com' });

  const view = createDecisionDetailView();
  document.body.appendChild(view.element);
  const controller = createDecisionController({
    detailView: view,
    decisionRepository,
    sessionState,
    auditLogService,
  });

  controller.showDecision('paper_access');
  expect(view.element.textContent).toContain('Decision not available');
  const logs = auditLogService.getLogs();
  expect(logs.some((log) => log.eventType === 'access_denied')).toBe(true);
});
