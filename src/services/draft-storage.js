const DRAFTS_KEY = 'cms.submission_drafts';

let cachedDrafts = null;
let saveFailureMode = false;
let loadFailureMode = false;

function loadDrafts() {
  if (cachedDrafts) {
    return cachedDrafts;
  }
  const raw = localStorage.getItem(DRAFTS_KEY);
  cachedDrafts = raw ? JSON.parse(raw) : {};
  return cachedDrafts;
}

function persistDrafts(drafts) {
  if (saveFailureMode) {
    throw new Error('draft_save_failure');
  }
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
  cachedDrafts = drafts;
}

export const draftStorage = {
  setSaveFailureMode(enabled) {
    saveFailureMode = Boolean(enabled);
  },
  setLoadFailureMode(enabled) {
    loadFailureMode = Boolean(enabled);
  },
  reset() {
    saveFailureMode = false;
    loadFailureMode = false;
    cachedDrafts = null;
    localStorage.removeItem(DRAFTS_KEY);
  },
  saveDraft(userKey, draft) {
    const drafts = { ...loadDrafts() };
    drafts[userKey] = draft;
    persistDrafts(drafts);
  },
  loadDraft(userKey) {
    if (loadFailureMode) {
      throw new Error('draft_load_failure');
    }
    const drafts = loadDrafts();
    return drafts[userKey] || null;
  },
  clearDraft(userKey) {
    const drafts = { ...loadDrafts() };
    if (drafts[userKey]) {
      delete drafts[userKey];
      persistDrafts(drafts);
    }
  },
};
