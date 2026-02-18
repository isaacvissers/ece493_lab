export const VALIDATION_FIELDS = Object.freeze({
  summary: 'summary',
  comments: 'commentsToAuthors',
  recommendation: 'recommendation',
  confidence: 'confidenceRating',
});

export const TEXT_VALIDATION_FIELDS = [
  VALIDATION_FIELDS.summary,
  VALIDATION_FIELDS.comments,
];

export const VALIDATION_TYPES = Object.freeze({
  required: 'required',
  invalidChars: 'invalid_chars',
  maxLength: 'max_length',
  rulesUnavailable: 'rules_unavailable',
  invalidOption: 'invalid_option',
  outOfRange: 'out_of_range',
});

export const FIELD_LABELS = Object.freeze({
  [VALIDATION_FIELDS.summary]: 'Summary',
  [VALIDATION_FIELDS.comments]: 'Comments to authors',
  [VALIDATION_FIELDS.recommendation]: 'Recommendation',
  [VALIDATION_FIELDS.confidence]: 'Confidence rating',
});

export const INVALID_CHAR_PATTERN = /[\u0000-\u001F\u007F]|<[^>]+>/;
