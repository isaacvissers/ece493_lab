const METADATA_KEY = 'cms.metadata_store';
const DRAFTS_KEY = 'cms.metadata_drafts';

let failureMode = false;
let cachedMetadata = null;
let cachedDrafts = null;

function loadMetadataStore() {
  if (cachedMetadata) {
    return cachedMetadata;
  }
  const raw = localStorage.getItem(METADATA_KEY);
  cachedMetadata = raw ? JSON.parse(raw) : {};
  return cachedMetadata;
}

function persistMetadataStore(store) {
  if (failureMode) {
    throw new Error('storage_failure');
  }
  localStorage.setItem(METADATA_KEY, JSON.stringify(store));
  cachedMetadata = store;
}

function loadDraftStore() {
  if (cachedDrafts) {
    return cachedDrafts;
  }
  const raw = localStorage.getItem(DRAFTS_KEY);
  cachedDrafts = raw ? JSON.parse(raw) : {};
  return cachedDrafts;
}

function persistDraftStore(store) {
  if (failureMode) {
    throw new Error('storage_failure');
  }
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(store));
  cachedDrafts = store;
}

export const metadataStorage = {
  setFailureMode(enabled) {
    failureMode = Boolean(enabled);
  },
  reset() {
    failureMode = false;
    cachedMetadata = null;
    cachedDrafts = null;
    localStorage.removeItem(METADATA_KEY);
    localStorage.removeItem(DRAFTS_KEY);
  },
  saveMetadata(userKey, metadata) {
    const store = { ...loadMetadataStore() };
    store[userKey] = {
      metadata,
      finalized: true,
    };
    persistMetadataStore(store);
  },
  loadMetadata(userKey) {
    const store = loadMetadataStore();
    return store[userKey] || null;
  },
  isFinalized(userKey) {
    const entry = metadataStorage.loadMetadata(userKey);
    return Boolean(entry && entry.finalized);
  },
  saveDraft(userKey, draft) {
    const store = { ...loadDraftStore() };
    store[userKey] = draft;
    persistDraftStore(store);
  },
  loadDraft(userKey) {
    const store = loadDraftStore();
    return store[userKey] || null;
  },
  clearDraft(userKey) {
    const store = { ...loadDraftStore() };
    if (store[userKey]) {
      delete store[userKey];
      persistDraftStore(store);
    }
  },
};
