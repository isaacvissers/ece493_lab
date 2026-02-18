import { reviewValidationService } from '../../src/services/review-validation-service.js';

const content = {
  summary: '',
  commentsToAuthors: 'Comments',
  recommendation: 'accept',
  confidenceRating: 4,
};

test('allows blank required fields on save draft', () => {
  const result = reviewValidationService.validate({
    content,
    requiredFields: ['summary'],
    action: 'save_draft',
  });

  expect(result.ok).toBe(true);
});

test('requires fields on submit', () => {
  const result = reviewValidationService.validate({
    content,
    requiredFields: ['summary'],
    action: 'submit_review',
  });

  expect(result.ok).toBe(false);
  expect(result.errors.summary).toBe('required');
});
