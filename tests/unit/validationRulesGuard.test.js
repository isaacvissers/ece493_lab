import { validationRulesService } from '../../src/services/validation-rules-service.js';
import { reviewFormStore } from '../../src/services/review-form-store.js';
import { errorLog } from '../../src/services/error-log.js';
import { createReviewForm } from '../../src/models/review-form.js';

beforeEach(() => {
  reviewFormStore.reset();
  errorLog.clear();
});

test('returns rules unavailable when form missing', () => {
  const result = validationRulesService.getRules({ formId: 'form_missing' });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('rules_unavailable');
  expect(errorLog.getFailures().some((entry) => entry.errorType === 'validation_rules_unavailable')).toBe(true);
});

test('returns rule set when form exists', () => {
  reviewFormStore.saveForm(createReviewForm({
    paperId: 'form_ok',
    requiredFields: ['summary'],
    maxLengths: { summary: 2000 },
  }));
  const result = validationRulesService.getRules({ formId: 'form_ok' });
  expect(result.ok).toBe(true);
  expect(result.rules.requiredFields).toContain('summary');
});
