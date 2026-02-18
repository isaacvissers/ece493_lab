import {
  REQUIRED_REVIEW_FIELDS,
  RECOMMENDATION_OPTIONS,
  CONFIDENCE_RANGE,
  REVIEW_FIELDS,
} from '../models/review-constants.js';

function toNumber(value) {
  if (typeof value === 'number') {
    return value;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

export const reviewValidationService = {
  validate({ content = {}, requiredFields = [] } = {}) {
    const errors = {};
    const fields = Array.from(new Set([
      ...REQUIRED_REVIEW_FIELDS,
      ...(Array.isArray(requiredFields) ? requiredFields : []),
    ]));

    fields.forEach((field) => {
      const value = content[field];
      if (value === null || value === undefined || `${value}`.trim() === '') {
        errors[field] = 'required';
      }
    });

    if (!errors[REVIEW_FIELDS.recommendation]) {
      const recommendation = content[REVIEW_FIELDS.recommendation];
      if (!RECOMMENDATION_OPTIONS.includes(recommendation)) {
        errors[REVIEW_FIELDS.recommendation] = 'invalid_option';
      }
    }

    if (!errors[REVIEW_FIELDS.confidence]) {
      const rating = toNumber(content[REVIEW_FIELDS.confidence]);
      if (rating === null || rating < CONFIDENCE_RANGE.min || rating > CONFIDENCE_RANGE.max) {
        errors[REVIEW_FIELDS.confidence] = 'out_of_range';
      }
    }

    return {
      ok: Object.keys(errors).length === 0,
      errors,
    };
  },
};
