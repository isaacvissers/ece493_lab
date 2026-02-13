import { validationService } from './validation-service.js';

const REQUIRED_FIELDS = [
  'authorNames',
  'affiliations',
  'contactEmail',
  'abstract',
  'keywords',
  'mainSource',
];

const ALLOWED_SOURCES = ['file upload', 'external repository link'];

function normalizeList(value) {
  return (value || '')
    .split(/[;,]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .join(', ');
}

function normalizeKeywords(value) {
  return (value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .join(', ');
}

function hasSemicolon(value) {
  return (value || '').includes(';');
}

export const metadataRules = {
  maxAbstractLength: 5000,
  allowedSources: ALLOWED_SOURCES.slice(),
};

export function validateMetadata(values, { mode = 'final' } = {}) {
  const errors = {};
  const normalized = { ...values };

  REQUIRED_FIELDS.forEach((field) => {
    const value = (values[field] || '').trim();
    normalized[field] = value;
    if (mode === 'final' && !value) {
      errors[field] = 'required';
    }
  });

  const authorRaw = normalized.authorNames;
  normalized.authorNames = normalizeList(authorRaw);
  if (authorRaw && !normalized.authorNames) {
    errors.authorNames = 'invalid_authors';
  }

  const affiliationRaw = normalized.affiliations;
  normalized.affiliations = normalizeList(affiliationRaw);
  if (affiliationRaw && !normalized.affiliations) {
    errors.affiliations = 'invalid_affiliations';
  }

  if (normalized.contactEmail) {
    normalized.contactEmail = validationService.normalizeEmail(normalized.contactEmail);
    if (!validationService.isEmailValid(normalized.contactEmail)) {
      errors.contactEmail = 'invalid_email';
    }
  }

  if (normalized.abstract) {
    if (normalized.abstract.length > metadataRules.maxAbstractLength) {
      errors.abstract = 'abstract_too_long';
    }
  }

  const keywordRaw = normalized.keywords;
  normalized.keywords = normalizeKeywords(keywordRaw);
  const semicolonPresent = hasSemicolon(keywordRaw);
  if (keywordRaw) {
    if (semicolonPresent) {
      errors.keywords = 'invalid_keywords';
    } else {
      const rawItems = keywordRaw.split(',').map((item) => item.trim());
      const items = rawItems.filter(Boolean);
      if (rawItems.some((item) => !item)) {
        errors.keywords = 'invalid_keywords';
      } else if (items.length < 1 || items.length > 10) {
        errors.keywords = 'invalid_keywords';
      }
    }
  } else if (mode === 'final') {
    errors.keywords = 'required';
  }

  if (normalized.mainSource) {
    if (!ALLOWED_SOURCES.includes(normalized.mainSource)) {
      errors.mainSource = 'invalid_source';
    }
  }

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    values: normalized,
  };
}
