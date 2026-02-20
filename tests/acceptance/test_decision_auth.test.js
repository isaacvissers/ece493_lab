import { createDecisionDetailView } from '../../src/views/decision_detail_view.js';
import { createDecisionController } from '../../src/controllers/decision_controller.js';
import { decisionRepository } from '../../src/services/decision_repository.js';
import { sessionState } from '../../src/models/session-state.js';
import { authService } from '../../src/services/auth_service.js';
import { auditLogService } from '../../src/services/audit_log_service.js';

beforeEach(() => {
  document.body.innerHTML = '';
  decisionRepository.reset();
  auditLogService.reset();
  sessionState.clear();
});

test('unauthenticated author is prompted to login and returns to decision view', () => {
  decisionRepository.seedPaper({
    paperId: 'paper_auth',
    title: 'Paper Auth',
    authorIds: ['author_auth'],
  });
  decisionRepository.seedDecision({
    decisionId: 'decision_auth',
    paperId: 'paper_auth',
    value: 'reject',
  });

  const detailView = createDecisionDetailView();
  document.body.append(detailView.element);

  let prompted = false;
  const controller = createDecisionController({
    detailView,
    decisionRepository,
    sessionState,
    authService,
    auditLogService,
    onAuthRequired: () => {
      prompted = true;
    },
  });

  controller.showDecision('paper_auth');
  expect(prompted).toBe(true);

  sessionState.authenticate({ id: 'author_auth', email: 'author@example.com' });
  controller.resumePending();
  expect(detailView.element.textContent).toContain('reject');
});
