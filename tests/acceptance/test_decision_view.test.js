import { createDecisionListView } from '../../src/views/decision_list_view.js';
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

test('author sees decision outcome and notes in submissions', () => {
  decisionRepository.seedPaper({
    paperId: 'paper_25',
    title: 'Paper 25',
    authorIds: ['author_1'],
  });
  decisionRepository.seedDecision({
    decisionId: 'decision_25',
    paperId: 'paper_25',
    value: 'accept',
    notes: 'Great work',
  });
  sessionState.authenticate({ id: 'author_1', email: 'author@example.com' });

  const listView = createDecisionListView();
  const detailView = createDecisionDetailView();
  document.body.append(listView.element, detailView.element);

  const controller = createDecisionController({
    listView,
    detailView,
    decisionRepository,
    sessionState,
    authService,
    auditLogService,
  });
  controller.init();

  const openButton = listView.element.querySelector('button');
  openButton.click();

  expect(detailView.element.textContent).toContain('accept');
  expect(detailView.element.textContent).toContain('Great work');
});
