import { validationService } from '../services/validation-service.js';

function generateDraftId() {
  return `draft_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export function validateDraft(values) {
  const errors = {};
  const title = (values.title || '').trim();
  const contactEmail = (values.contactEmail || '').trim();

  if (!title) {
    errors.title = 'required';
  }
  if (!contactEmail) {
    errors.contactEmail = 'required';
  } else if (!validationService.isEmailValid(contactEmail)) {
    errors.contactEmail = 'invalid_email';
  }

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    values: {
      ...values,
      title,
      contactEmail,
    },
  };
}

export function createDraft(values, fileMeta) {
  return {
    id: generateDraftId(),
    draftData: {
      title: values.title || '',
      authorNames: values.authorNames || '',
      affiliations: values.affiliations || '',
      contactEmail: values.contactEmail || '',
      abstract: values.abstract || '',
      keywords: values.keywords || '',
      mainSource: values.mainSource || '',
    },
    draftFileMetadata: fileMeta || null,
    savedAt: new Date().toISOString(),
  };
}

export function restoreDraft(draft) {
  if (!draft || !draft.draftData) {
    return null;
  }
  return {
    ...draft.draftData,
    fileMeta: draft.draftFileMetadata || null,
  };
}
