export function createMetadataDraft(submissionId, values) {
  return {
    submissionId,
    draftData: { ...values },
    savedAt: new Date().toISOString(),
  };
}

export function restoreMetadataDraft(draft) {
  if (!draft || !draft.draftData) {
    return null;
  }
  return { ...draft.draftData };
}
