import { decisionStorage } from './storage.js';
import { accessControl } from './access_control.js';

const PAPER_KEY = 'cms.papers';
const DECISION_KEY = 'cms.decisions';

function loadPapers() {
  return decisionStorage.read(PAPER_KEY, []);
}

function loadDecisions() {
  return decisionStorage.read(DECISION_KEY, []);
}

function persistDecisions(decisions) {
  decisionStorage.write(DECISION_KEY, decisions);
}

function findPaper(paperId) {
  return loadPapers().find((paper) => paper.paperId === paperId || paper.id === paperId) || null;
}

function findDecision(paperId) {
  return loadDecisions().find((decision) => decision.paperId === paperId) || null;
}

function findDecisionById(decisionId) {
  return loadDecisions().find((decision) => decision.decisionId === decisionId) || null;
}

function isReleased({ paper, decision, now }) {
  // paper is always provided when isReleased is called
  /* istanbul ignore next */
  const releaseAt = decision && decision.releasedAt ? decision.releasedAt : (paper ? paper.decisionReleaseAt : null);
  if (!releaseAt) {
    return true;
  }
  const releaseTime = Date.parse(releaseAt);
  if (Number.isNaN(releaseTime)) {
    return true;
  }
  return releaseTime <= now;
}

export const decisionRepository = {
  reset() {
    decisionStorage.remove(PAPER_KEY);
    decisionStorage.remove(DECISION_KEY);
  },
  seedPaper(paper) {
    const papers = loadPapers().slice();
    papers.push(paper);
    decisionStorage.write(PAPER_KEY, papers);
  },
  seedDecision(decision) {
    const decisions = loadDecisions().slice();
    decisions.push(decision);
    persistDecisions(decisions);
  },
  getDecisionForAuthor({ paperId, authorId, now = Date.now() } = {}) {
    const paper = findPaper(paperId);
    if (!paper) {
      return { ok: false, reason: 'paper_not_found' };
    }
    if (!accessControl.isAuthor({ paper, authorId })) {
      return { ok: false, reason: 'access_denied' };
    }
    const decision = findDecision(paperId);
    if (!decision) {
      return { ok: false, reason: 'decision_missing' };
    }
    if (!isReleased({ paper, decision, now })) {
      return { ok: false, reason: 'pending', paper, decision: null };
    }
    return { ok: true, paper, decision };
  },
  listDecisionsForAuthor({ authorId, now = Date.now() } = {}) {
    const papers = loadPapers().filter((paper) => accessControl.isAuthor({ paper, authorId }));
    return papers.map((paper) => {
      const decision = findDecision(paper.paperId || paper.id);
      const released = decision ? isReleased({ paper, decision, now }) : false;
      return {
        paper,
        decision: released ? decision : null,
        status: decision ? (released ? 'released' : 'pending') : 'missing',
      };
    });
  },
  saveDecision(decision) {
    if (!decision || !decision.paperId) {
      return { ok: false, reason: 'invalid_decision' };
    }
    const decisions = loadDecisions().slice();
    const existingIndex = decisions.findIndex((entry) => entry.paperId === decision.paperId);
    if (existingIndex >= 0) {
      decisions[existingIndex] = decision;
    } else {
      decisions.push(decision);
    }
    persistDecisions(decisions);
    return { ok: true };
  },
  getDecisionById(decisionId) {
    if (!decisionId) {
      return null;
    }
    return findDecisionById(decisionId);
  },
  getPaperById(paperId) {
    return findPaper(paperId);
  },
};
