import { reviewValidationService } from '../../src/services/review-validation-service.js';
import { REQUIRED_REVIEW_FIELDS } from '../../src/models/review-constants.js';

test('flags missing required fields', () => {
  const result = reviewValidationService.validate({ content: {} });
  REQUIRED_REVIEW_FIELDS.forEach((field) => {
    expect(result.errors).toHaveProperty(field);
  });
  expect(result.ok).toBe(false);
});

test('flags invalid recommendation option', () => {
  const result = reviewValidationService.validate({
    content: {
      summary: 'Summary',
      commentsToAuthors: 'Comments',
      recommendation: 'maybe',
      confidenceRating: 3,
    },
  });
  expect(result.ok).toBe(false);
  expect(result.errors.recommendation).toBe('invalid_option');
});

test('flags out-of-range confidence rating', () => {
  const result = reviewValidationService.validate({
    content: {
      summary: 'Summary',
      commentsToAuthors: 'Comments',
      recommendation: 'accept',
      confidenceRating: 9,
    },
  });
  expect(result.ok).toBe(false);
  expect(result.errors.confidenceRating).toBe('out_of_range');
});
