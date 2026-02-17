export function createDraftSaveState(submissionId, lastSavedAt = new Date().toISOString()) {
  return {
    submissionId,
    lastSavedAt,
  };
}
