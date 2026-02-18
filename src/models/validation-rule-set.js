function generateRuleSetId() {
  return `vrs_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export function createValidationRuleSet({
  ruleSetId = null,
  requiredFields = [],
  invalidCharacterPolicy = 'no_control_chars_no_markup',
  maxLengths = {},
} = {}) {
  return {
    ruleSetId: ruleSetId || generateRuleSetId(),
    requiredFields: Array.isArray(requiredFields) ? requiredFields : [],
    invalidCharacterPolicy,
    maxLengths: maxLengths && typeof maxLengths === 'object' ? { ...maxLengths } : {},
  };
}

export function loadValidationRuleSet(form) {
  if (!form) {
    return null;
  }
  return createValidationRuleSet({
    requiredFields: form.requiredFields,
    invalidCharacterPolicy: form.allowedCharactersRule || 'no_control_chars_no_markup',
    maxLengths: form.maxLengths,
  });
}
