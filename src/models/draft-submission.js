function generateDraftId() {
  return `draft_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
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

export function getDraftWarnings(values) {
  const warnings = [];
  REQUIRED_FIELDS.forEach((field) => {
    const value = (values[field] || '').trim();
    if (!value) {
      warnings.push(field);
    }
  });
  return warnings;
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

export function createDraftSubmission(values, file) {
  return {
    id: generateDraftId(),
    values: { ...values },
    file: file || null,
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
    savedAt: draft.savedAt || null,
  };
}
