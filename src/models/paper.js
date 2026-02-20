function generatePaperId() {
  return `paper_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export function createPaper({
  id = null,
  paperId = null,
  title = '',
  status = 'submitted',
  authorIds = [],
  assignedRefereeEmails = [],
  assignmentVersion = 0,
  editorId = null,
  decisionReleaseAt = null,
} = {}) {
  const resolvedId = id || paperId || generatePaperId();
  return {
    id: resolvedId,
    paperId: resolvedId,
    title,
    status,
    authorIds: Array.isArray(authorIds) ? authorIds : [],
    assignedRefereeEmails: Array.isArray(assignedRefereeEmails) ? assignedRefereeEmails : [],
    assignmentVersion: typeof assignmentVersion === 'number' ? assignmentVersion : 0,
    editorId,
    decisionReleaseAt,
  };
}

export function isEligibleStatus(status) {
  if (!status) {
    return false;
  }
  const normalized = `${status}`.trim().toLowerCase();
  return normalized === 'submitted' || normalized === 'eligible';
}

export function assignReferees(paper, refereeEmails = []) {
  const emails = Array.isArray(refereeEmails) ? refereeEmails : [];
  return {
    ...paper,
    assignedRefereeEmails: emails.slice(),
    assignmentVersion: (paper.assignmentVersion || 0) + 1,
  };
}

export function isPaperAvailable(paper) {
  if (!paper || !paper.status) {
    return false;
  }
  const normalized = `${paper.status}`.trim().toLowerCase();
  return ['available', 'submitted', 'eligible'].includes(normalized);
}
