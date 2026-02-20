import { createDecision } from '../../src/models/Decision.js';
import { DECISION_VALUES, REQUIRED_REVIEW_COUNT } from '../../src/models/decisionConstants.js';
import { createDecision as createDecisionImpl } from '../../src/models/decision.js';
import { DECISION_VALUES as decisionValuesImpl } from '../../src/models/decision-constants.js';

test('decision model wrappers re-export implementations', () => {
  expect(createDecision).toBe(createDecisionImpl);
  expect(DECISION_VALUES).toBe(decisionValuesImpl);
  expect(REQUIRED_REVIEW_COUNT).toBe(3);
});

test('createDecision respects provided ids and timestamps', () => {
  const decision = createDecision({
    decisionId: 'decision_custom',
    paperId: 'paper_custom',
    editorId: 'editor_custom',
    value: 'unknown',
    comments: 'Notes',
    decidedAt: '2025-01-01T00:00:00.000Z',
  });

  expect(decision.decisionId).toBe('decision_custom');
  expect(decision.value).toBe('unknown');
  expect(decision.decidedAt).toBe('2025-01-01T00:00:00.000Z');
});

test('createDecision normalizes known values', () => {
  const decision = createDecision({
    paperId: 'paper_norm',
    editorId: 'editor_norm',
    value: 'ACCEPT',
  });

  expect(decision.value).toBe('accept');
});

test('createDecision handles missing value', () => {
  const decision = createDecision({
    paperId: 'paper_empty',
    editorId: 'editor_empty',
  });

  expect(decision.value).toBe('');
});

test('createDecision handles missing arguments', () => {
  const decision = createDecision();
  expect(decision.decisionId).toContain('decision_');
});
