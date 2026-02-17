export function createDraftSubmission(metadata, file) {
  return {
    metadata: { ...metadata },
    manuscriptFile: file || null,
    savedAt: new Date().toISOString(),
  };
}
