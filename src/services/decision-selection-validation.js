import { DECISION_VALUES } from '../models/decision-constants.js';

export function validateDecisionSelection(value) {
  const trimmed = value ? `${value}`.trim() : '';
  if (!trimmed) {
    return { ok: false, reason: 'missing' };
  }
  const normalized = trimmed.toLowerCase();
  if (normalized === DECISION_VALUES.accept) {
    return { ok: true, value: DECISION_VALUES.accept };
  }
  if (normalized === DECISION_VALUES.reject) {
    return { ok: true, value: DECISION_VALUES.reject };
  }
  return { ok: false, reason: 'invalid' };
}
