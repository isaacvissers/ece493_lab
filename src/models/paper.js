function generatePaperId() {
  return `paper_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export function createPaper({ paperId = null, editorId = null } = {}) {
  return {
    paperId: paperId || generatePaperId(),
    editorId,
  };
}
