import { validationService } from './validation-service.js';

const REQUIRED_FIELDS = [
  'authorNames',
  'affiliations',
  'contactEmail',
  'abstract',
  'keywords',
  'mainSource',
];

const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'tex'];

function getFileExtension(name) {
  const parts = name.toLowerCase().split('.');
  return parts.length > 1 ? parts.pop() : '';
}

function isFileTypeAllowed(file) {
  const extension = getFileExtension(file.name || '');
  return ALLOWED_EXTENSIONS.includes(extension);
}

export const submissionValidationRules = {
  allowedExtensions: ALLOWED_EXTENSIONS.slice(),
};

export function validateSubmission(values, file, { mode = 'final' } = {}) {
  const errors = {};
  const normalized = { ...values };

  REQUIRED_FIELDS.forEach((field) => {
    const value = (values[field] || '').trim();
    normalized[field] = value;
    if (mode === 'final' && !value) {
      errors[field] = 'required';
    }
  });

  if (normalized.contactEmail) {
    normalized.contactEmail = validationService.normalizeEmail(normalized.contactEmail);
    if (!validationService.isEmailValid(normalized.contactEmail)) {
      errors.contactEmail = 'invalid_email';
    }
  } else if (mode === 'final') {
    errors.contactEmail = 'required';
  }

  if (mode === 'final') {
    if (!file) {
      errors.manuscriptFile = 'file_required';
    } else if (!isFileTypeAllowed(file)) {
      errors.manuscriptFile = 'file_type_invalid';
    }
  } else if (file && !isFileTypeAllowed(file)) {
    errors.manuscriptFile = 'file_type_invalid';
  }

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    values: normalized,
  };
}
