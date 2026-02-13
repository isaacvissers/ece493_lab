const MANUSCRIPTS_KEY = 'cms.manuscripts';
const DRAFTS_KEY = 'cms.submission_drafts';

let failureMode = false;
let cachedManuscripts = null;
let cachedDrafts = null;

function loadManuscripts() {
  if (cachedManuscripts) {
    return cachedManuscripts;
  }
  const raw = localStorage.getItem(MANUSCRIPTS_KEY);
  cachedManuscripts = raw ? JSON.parse(raw) : [];
  return cachedManuscripts;
}

function persistManuscripts(manuscripts) {
  if (failureMode) {
    throw new Error('storage_failure');
  }
  localStorage.setItem(MANUSCRIPTS_KEY, JSON.stringify(manuscripts));
  cachedManuscripts = manuscripts;
}

function loadDrafts() {
  if (cachedDrafts) {
    return cachedDrafts;
  }
  const raw = localStorage.getItem(DRAFTS_KEY);
  cachedDrafts = raw ? JSON.parse(raw) : {};
  return cachedDrafts;
}

function persistDrafts(drafts) {
  if (failureMode) {
    throw new Error('storage_failure');
  }
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
  cachedDrafts = drafts;
}

export const submissionStorage = {
  setFailureMode(enabled) {
    failureMode = Boolean(enabled);
  },
  reset() {
    failureMode = false;
    cachedManuscripts = null;
    cachedDrafts = null;
    localStorage.removeItem(MANUSCRIPTS_KEY);
    localStorage.removeItem(DRAFTS_KEY);
  },
  getManuscripts() {
    return loadManuscripts().slice();
  },
  saveSubmission(manuscript) {
    const manuscripts = loadManuscripts().slice();
    manuscripts.push(manuscript);
    persistManuscripts(manuscripts);
  },
  saveDraft(userKey, draft) {
    const drafts = { ...loadDrafts() };
    drafts[userKey] = draft;
    persistDrafts(drafts);
  },
  loadDraft(userKey) {
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
