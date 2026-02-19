const DRAFTS_KEY = 'cms.review_drafts';

let cachedDrafts = null;
let failureMode = false;

function loadDrafts() {
  if (cachedDrafts) {
    return cachedDrafts;
  }
  if (failureMode) {
    throw new Error('draft_store_failure');
  }
  const raw = localStorage.getItem(DRAFTS_KEY);
  cachedDrafts = raw ? JSON.parse(raw) : {};
  return cachedDrafts;
}

function persistDrafts(drafts) {
  if (failureMode) {
    throw new Error('draft_store_failure');
  }
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
  cachedDrafts = drafts;
}

function makeKey(paperId, reviewerEmail) {
  return `${paperId}::${reviewerEmail}`;
}

export const reviewDraftStore = {
  setFailureMode(enabled) {
    failureMode = Boolean(enabled);
  },
  reset() {
    failureMode = false;
    cachedDrafts = null;
    localStorage.removeItem(DRAFTS_KEY);
  },
  saveDraft(draft) {
    const drafts = { ...loadDrafts() };
    const key = makeKey(draft.paperId, draft.reviewerEmail);
    drafts[key] = draft;
    persistDrafts(drafts);
    return draft;
  },
  getDraft(paperId, reviewerEmail) {
    const drafts = loadDrafts();
    return drafts[makeKey(paperId, reviewerEmail)] || null;
  },
};
