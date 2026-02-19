import { jest } from '@jest/globals';

test('review validation service covers FIELD_LABELS fallback branches', async () => {
  jest.resetModules();
  jest.unstable_mockModule('../../src/models/validation-constants.js', () => ({
    REQUIRED_REVIEW_FIELDS: ['summary'],
    RECOMMENDATION_OPTIONS: ['accept'],
    CONFIDENCE_RANGE: { min: 1, max: 5 },
    REVIEW_FIELDS: { recommendation: 'recommendation', confidence: 'confidenceRating' },
    INVALID_CHAR_PATTERN: /[<>]/,
    TEXT_VALIDATION_FIELDS: ['custom_text'],
    VALIDATION_TYPES: {
      required: 'required',
      invalidChars: 'invalid_chars',
      maxLength: 'max_length',
      invalidOption: 'invalid_option',
      outOfRange: 'out_of_range',
    },
    FIELD_LABELS: {},
  }));

  const { reviewValidationService } = await import('../../src/services/review-validation-service.js');
  reviewValidationService.validate({
    content: { custom_text: '<bad>' },
    requiredFields: [],
    maxLengths: { custom_text: 1 },
    invalidCharacterPolicy: 'no_control_chars_no_markup',
    action: 'submit_review',
  });
});

test('review submission service covers missing default error log', async () => {
  jest.resetModules();
  jest.unstable_mockModule('../../src/services/error-log.js', () => ({ errorLog: null }));
  const { reviewSubmissionService } = await import('../../src/services/review-submission-service.js');

  reviewSubmissionService.reset();
  reviewSubmissionService.setSubmissionFailureMode(true);
  reviewSubmissionService.submit({
    paperId: 'paper',
    reviewerEmail: 'rev@example.com',
    content: { summary: 'Ok' },
    assignmentStore: { getAssignments: () => [{ paperId: 'paper', reviewerEmail: 'rev@example.com', status: 'accepted' }] },
    reviewFormStore: { getForm: () => ({ requiredFields: [], status: 'active' }) },
    reviewValidationService: { validate: () => ({ ok: true, errors: {} }) },
  });
  reviewSubmissionService.setSubmissionFailureMode(false);

  reviewSubmissionService.preserveDraft({
    paperId: 'paper',
    reviewerEmail: 'rev@example.com',
    content: {},
    reviewDraftStore: { saveDraft: () => { throw {}; } },
  });
});
