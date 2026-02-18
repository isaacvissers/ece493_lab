function generatePaperId() {
  return `paper_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export function createPaper({
  id = null,
  title = '',
  status = 'Submitted',
  assignedRefereeEmails = [],
  assignmentVersion = 0,
  manuscriptAvailable = true,
} = {}) {
  return {
    id: id || generatePaperId(),
    title,
    status,
    assignedRefereeEmails: Array.isArray(assignedRefereeEmails) ? assignedRefereeEmails : [],
    assignmentVersion,
    manuscriptAvailable,
  };
}

export function isEligibleStatus(status) {
  const normalized = (status || '').toString().trim().toLowerCase();
  return normalized === 'submitted' || normalized === 'eligible';
}

export function assignReferees(paper, refereeEmails) {
  return {
    ...paper,
    assignedRefereeEmails: refereeEmails.slice(),
    assignmentVersion: (paper.assignmentVersion || 0) + 1,
  };
}

export function isPaperAvailable(paper) {
  if (!paper) {
    return false;
  }
  const normalized = (paper.status || '').toString().trim().toLowerCase();
  if (normalized === 'withdrawn' || normalized === 'removed') {
    return false;
  }
  if (paper.manuscriptAvailable === false) {
    return false;
  }
  return true;
}
