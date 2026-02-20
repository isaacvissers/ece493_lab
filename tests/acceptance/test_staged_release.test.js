import { createDecisionDetailView } from '../../src/views/decision_detail_view.js';
import { createDecisionController } from '../../src/controllers/decision_controller.js';
import { decisionRepository } from '../../src/services/decision_repository.js';
import { sessionState } from '../../src/models/session-state.js';

beforeEach(() => {
  decisionRepository.reset();
  sessionState.clear();
  document.body.innerHTML = '';
});

test('staged release shows pending until release time', () => {
  decisionRepository.seedPaper({
    paperId: 'paper_stage',
    title: 'Staged Paper',
    authorIds: ['author_stage'],
    decisionReleaseAt: new Date(Date.now() + 60000).toISOString(),
  });
  decisionRepository.seedDecision({
    decisionId: 'decision_stage',
    paperId: 'paper_stage',
    value: 'accept',
  });
  sessionState.authenticate({ id: 'author_stage', email: 'author@example.com' });

  const view = createDecisionDetailView();
  document.body.appendChild(view.element);
  const controller = createDecisionController({
    detailView: view,
    decisionRepository,
    sessionState,
  });

  controller.showDecision('paper_stage');
  expect(view.element.textContent).toContain('Pending until');
});
