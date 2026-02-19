import {
  REQUIRED_REVIEW_FIELDS,
  RECOMMENDATION_OPTIONS,
  CONFIDENCE_RANGE,
  REVIEW_FIELDS,
} from '../models/review-constants.js';
import {
  INVALID_CHAR_PATTERN,
  TEXT_VALIDATION_FIELDS,
  VALIDATION_TYPES,
  FIELD_LABELS,
} from '../models/validation-constants.js';

function toNumber(value) {
  if (typeof value === 'number') {
    return value;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

export const reviewValidationService = {
  validate({
    content = {},
    requiredFields = [],
    maxLengths = {},
    invalidCharacterPolicy = 'no_control_chars_no_markup',
    action = 'submit_review',
  } = {}) {
    const errors = {};
    const messages = {};
    const required = Array.isArray(requiredFields) ? requiredFields : [];
    const fields = required.length ? required : REQUIRED_REVIEW_FIELDS;

    if (action === 'submit_review') {
      fields.forEach((field) => {
        const value = content[field];
        if (value === null || value === undefined || `${value}`.trim() === '') {
          errors[field] = VALIDATION_TYPES.required;
          messages[field] = `${FIELD_LABELS[field] || field} is required.`;
        }
      });
    }

    if (invalidCharacterPolicy === 'no_control_chars_no_markup') {
      TEXT_VALIDATION_FIELDS.forEach((field) => {
        const value = content[field];
        if (value === null || value === undefined || `${value}`.trim() === '') {
          return;
        }
        if (INVALID_CHAR_PATTERN.test(`${value}`)) {
          errors[field] = VALIDATION_TYPES.invalidChars;
          messages[field] = `${FIELD_LABELS[field] || field} contains invalid characters.`;
        }
      });
    }

    TEXT_VALIDATION_FIELDS.forEach((field) => {
      const value = content[field];
      const max = maxLengths && Object.prototype.hasOwnProperty.call(maxLengths, field)
        ? maxLengths[field]
        : null;
      if (!max || value === null || value === undefined || `${value}` === '') {
        return;
      }
      if (`${value}`.length > max) {
        errors[field] = VALIDATION_TYPES.maxLength;
        messages[field] = `${FIELD_LABELS[field] || field} must be at most ${max} characters.`;
      }
    });

    if (!errors[REVIEW_FIELDS.recommendation]) {
      const recommendation = content[REVIEW_FIELDS.recommendation];
      const shouldValidate = recommendation !== null && recommendation !== undefined && `${recommendation}`.trim() !== '';
      if (shouldValidate && !RECOMMENDATION_OPTIONS.includes(recommendation)) {
        errors[REVIEW_FIELDS.recommendation] = VALIDATION_TYPES.invalidOption;
        messages[REVIEW_FIELDS.recommendation] = 'Recommendation must be one of the allowed options.';
      }
    }

    if (!errors[REVIEW_FIELDS.confidence]) {
      const rating = toNumber(content[REVIEW_FIELDS.confidence]);
      const hasValue = content[REVIEW_FIELDS.confidence] !== null
        && content[REVIEW_FIELDS.confidence] !== undefined
        && `${content[REVIEW_FIELDS.confidence]}`.trim() !== '';
      if (hasValue && (rating === null || rating < CONFIDENCE_RANGE.min || rating > CONFIDENCE_RANGE.max)) {
        errors[REVIEW_FIELDS.confidence] = VALIDATION_TYPES.outOfRange;
        messages[REVIEW_FIELDS.confidence] = `Confidence rating must be between ${CONFIDENCE_RANGE.min} and ${CONFIDENCE_RANGE.max}.`;
      }
    }

    return {
      ok: Object.keys(errors).length === 0,
      errors,
      messages,
    };
  },
};
