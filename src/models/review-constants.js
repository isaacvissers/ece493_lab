export const REVIEW_FIELDS = Object.freeze({
  recommendation: 'recommendation',
  summary: 'summary',
  comments: 'commentsToAuthors',
  confidence: 'confidenceRating',
});

export const REQUIRED_REVIEW_FIELDS = [
  REVIEW_FIELDS.recommendation,
  REVIEW_FIELDS.summary,
  REVIEW_FIELDS.comments,
  REVIEW_FIELDS.confidence,
];

export const RECOMMENDATION_OPTIONS = [
  'accept',
  'minor_revision',
  'major_revision',
  'reject',
];

export const CONFIDENCE_RANGE = Object.freeze({
  min: 1,
  max: 5,
});
