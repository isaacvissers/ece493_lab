import { createDecisionReleaseController } from '../../src/controllers/decision_release_controller.js';
import { decisionRepository } from '../../src/services/decision_repository.js';

beforeEach(() => {
  decisionRepository.reset();
});

test('decision release contract supports release by decision id', () => {
  decisionRepository.seedDecision({ decisionId: 'decision_contract', paperId: 'paper_contract', value: 'accept' });
  const controller = createDecisionReleaseController({ decisionRepository });
  const result = controller.releaseDecisionById('decision_contract');
  expect(result.status).toBe(200);
});

test('decision release contract returns conflict when missing decision', () => {
  const controller = createDecisionReleaseController({ decisionRepository });
  const result = controller.releaseDecisionById('missing');
  expect(result.status).toBe(409);
});

test('decision release contract returns conflict when already released', () => {
  decisionRepository.seedDecision({ decisionId: 'decision_done', paperId: 'paper_done', value: 'accept', releasedAt: new Date().toISOString() });
  const controller = createDecisionReleaseController({ decisionRepository });
  const result = controller.releaseDecisionById('decision_done');
  expect(result.status).toBe(409);
});

test('decision release contract returns conflict when pending release', () => {
  decisionRepository.seedPaper({ paperId: 'paper_future', decisionReleaseAt: new Date(Date.now() + 60000).toISOString() });
  decisionRepository.seedDecision({ decisionId: 'decision_future', paperId: 'paper_future', value: 'accept' });
  const controller = createDecisionReleaseController({ decisionRepository });
  const result = controller.releaseDecisionById('decision_future');
  expect(result.status).toBe(409);
});
