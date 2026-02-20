import { DECISION_VALUES } from './decision-constants.js';

function generateDecisionId() {
  return `decision_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export function createDecision({
  decisionId = null,
  paperId,
  editorId,
  value,
  comments = '',
  decidedAt = null,
} = {}) {
  const normalizedValue = value ? `${value}`.trim().toLowerCase() : '';
  const resolvedValue = DECISION_VALUES[normalizedValue] || normalizedValue;
  return {
    decisionId: decisionId || generateDecisionId(),
    paperId,
    editorId,
    value: resolvedValue,
    comments,
    decidedAt: decidedAt || new Date().toISOString(),
  };
}
