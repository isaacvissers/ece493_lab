import { reviewValidationService } from '../../src/services/review-validation-service.js';
import { VALIDATION_TYPES } from '../../src/models/validation-constants.js';

const baseContent = {
  summary: 'Summary text',
  commentsToAuthors: 'Comments',
  recommendation: 'accept',
  confidenceRating: 4,
};

test('blocks missing required fields on submit', () => {
  const result = reviewValidationService.validate({
    content: { ...baseContent, summary: '' },
    requiredFields: ['summary'],
    action: 'submit_review',
  });

  expect(result.ok).toBe(false);
  expect(result.errors.summary).toBe(VALIDATION_TYPES.required);
});

test('blocks invalid characters on save', () => {
  const result = reviewValidationService.validate({
    content: { ...baseContent, summary: 'Bad <script>' },
    requiredFields: ['summary'],
    action: 'save_draft',
  });

  expect(result.ok).toBe(false);
  expect(result.errors.summary).toBe(VALIDATION_TYPES.invalidChars);
});
