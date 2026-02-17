import { validationService } from '../services/validation-service.js';

function generateId() {
  return `ms_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

const REQUIRED_FIELDS = [
  'title',
  'authorNames',
  'affiliations',
  'contactEmail',
  'abstract',
  'keywords',
  'mainSource',
];

export function validateManuscript(values) {
  const errors = {};
  const normalized = { ...values };

  REQUIRED_FIELDS.forEach((field) => {
    const value = (values[field] || '').trim();
    normalized[field] = value;
    if (!value) {
      errors[field] = 'required';
    }
  });

  if (!errors.contactEmail && !validationService.isEmailValid(normalized.contactEmail)) {
    errors.contactEmail = 'invalid_email';
  }

  if (!errors.authorNames) {
    const names = normalized.authorNames.split(',').map((name) => name.trim()).filter(Boolean);
    if (names.length === 0) {
      errors.authorNames = 'invalid_author_names';
    }
  }

  if (!errors.keywords) {
    const keywords = normalized.keywords.split(',').map((word) => word.trim());
    if (keywords.length === 0 || keywords.some((word) => !word)) {
      errors.keywords = 'invalid_keywords';
    }
  }

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    values: normalized,
  };
}

export function createManuscript(values, fileMeta, submittedBy = null) {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    submittedBy,
    title: values.title,
    authorNames: values.authorNames,
    affiliations: values.affiliations,
    contactEmail: values.contactEmail,
    abstract: values.abstract,
    keywords: values.keywords,
    mainSource: values.mainSource,
    file: fileMeta,
    status: 'submitted',
    createdAt: now,
    updatedAt: now,
  };
}
