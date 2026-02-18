import { assignReferees, createPaper, isEligibleStatus } from '../models/paper.js';

const PAPERS_KEY = 'cms.papers';

let cachedPapers = null;
let failureMode = false;

function loadPapers() {
  if (cachedPapers) {
    return cachedPapers;
  }
  const raw = localStorage.getItem(PAPERS_KEY);
  cachedPapers = raw ? JSON.parse(raw) : [];
  return cachedPapers;
}

function persistPapers(papers) {
  if (failureMode) {
    throw new Error('assignment_storage_failure');
  }
  localStorage.setItem(PAPERS_KEY, JSON.stringify(papers));
  cachedPapers = papers;
}

export const assignmentStorage = {
  setFailureMode(enabled) {
    failureMode = Boolean(enabled);
  },
  reset() {
    failureMode = false;
    cachedPapers = null;
    localStorage.removeItem(PAPERS_KEY);
  },
  seedPaper(paper) {
    const papers = loadPapers().slice();
    papers.push(createPaper(paper));
    persistPapers(papers);
  },
  getPapers() {
    return loadPapers().slice();
  },
  getPaper(paperId) {
    return loadPapers().find((paper) => paper.id === paperId) || null;
  },
  updatePaperStatus({ paperId, status, expectedVersion = null }) {
    const papers = loadPapers().slice();
    const index = papers.findIndex((paper) => paper.id === paperId);
    if (index === -1) {
      throw new Error('paper_not_found');
    }
    const paper = papers[index];
    if (expectedVersion !== null && paper.assignmentVersion !== expectedVersion) {
      throw new Error('concurrent_change');
    }
    papers[index] = { ...paper, status };
    persistPapers(papers);
    return papers[index];
  },
  saveAssignments({ paperId, refereeEmails, expectedVersion }) {
    const papers = loadPapers().slice();
    const index = papers.findIndex((paper) => paper.id === paperId);
    if (index === -1) {
      throw new Error('paper_not_found');
    }
    const paper = papers[index];
    if (!isEligibleStatus(paper.status)) {
      throw new Error('paper_ineligible');
    }
    if (paper.assignmentVersion !== expectedVersion) {
      throw new Error('concurrent_change');
    }
    const updated = assignReferees(paper, refereeEmails);
    papers[index] = updated;
    persistPapers(papers);
    return updated;
  },
};
