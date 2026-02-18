import { reviewFormStore as defaultReviewFormStore } from './review-form-store.js';
import { errorLog as defaultErrorLog } from './error-log.js';
import { loadValidationRuleSet } from '../models/validation-rule-set.js';

export const validationRulesService = {
  getRules({ formId, reviewFormStore = defaultReviewFormStore, errorLog = defaultErrorLog } = {}) {
    try {
      const form = reviewFormStore.getForm(formId);
      const ruleSet = loadValidationRuleSet(form);
      if (!ruleSet) {
        if (errorLog) {
          errorLog.logFailure({
            errorType: 'validation_rules_unavailable',
            message: 'validation_rules_missing',
            context: formId,
          });
        }
        return { ok: false, reason: 'rules_unavailable' };
      }
      return { ok: true, rules: ruleSet };
    } catch (error) {
      if (errorLog) {
        errorLog.logFailure({
          errorType: 'validation_rules_unavailable',
          message: error && error.message ? error.message : 'validation_rules_error',
          context: formId,
        });
      }
      return { ok: false, reason: 'rules_unavailable' };
    }
  },
};
