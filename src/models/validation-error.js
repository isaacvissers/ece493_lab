import { VALIDATION_TYPES } from './validation-constants.js';

export function createValidationError({ fieldKey = null, message = '', type = VALIDATION_TYPES.required } = {}) {
  return {
    fieldKey,
    message,
    type,
  };
}
