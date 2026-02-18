import { createReviewForm } from '../models/review-form.js';
import { createReviewDraft } from '../models/review-draft.js';
import { createReviewerAssignment } from '../models/reviewer-assignment.js';
import { createSubmittedReview } from '../models/submitted-review.js';
import { createValidationRuleSet } from '../models/validation-rule-set.js';
import { REQUIRED_REVIEW_FIELDS } from '../models/review-constants.js';

export function buildReviewFixtures(overrides = {}) {
  const paperId = overrides.paperId || 'paper_fixture';
  const reviewerEmail = overrides.reviewerEmail || 'reviewer@example.com';

  return {
    reviewForm: createReviewForm({
      paperId,
      status: 'active',
      requiredFields: REQUIRED_REVIEW_FIELDS,
      allowedCharactersRule: 'no_control_chars_no_markup',
      maxLengths: {
        summary: 2000,
        commentsToAuthors: 4000,
      },
      ...(overrides.reviewForm || {}),
    }),
    validationRuleSet: createValidationRuleSet({
      requiredFields: REQUIRED_REVIEW_FIELDS,
      invalidCharacterPolicy: 'no_control_chars_no_markup',
      maxLengths: {
        summary: 2000,
        commentsToAuthors: 4000,
      },
      ...(overrides.validationRuleSet || {}),
    }),
    reviewDraft: createReviewDraft({
      paperId,
      reviewerEmail,
      content: {
        summary: 'Fixture summary',
        commentsToAuthors: 'Fixture comments',
        recommendation: 'accept',
        confidenceRating: 4,
      },
      ...(overrides.reviewDraft || {}),
    }),
    reviewerAssignment: createReviewerAssignment({
      paperId,
      reviewerEmail,
      status: 'accepted',
      ...(overrides.reviewerAssignment || {}),
    }),
    submittedReview: createSubmittedReview({
      paperId,
      reviewerEmail,
      content: {
        summary: 'Submitted summary',
        commentsToAuthors: 'Submitted comments',
        recommendation: 'accept',
        confidenceRating: 4,
      },
      ...(overrides.submittedReview || {}),
    }),
  };
}
