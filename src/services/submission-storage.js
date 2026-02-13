const MANUSCRIPTS_KEY = 'cms.manuscripts';
const DRAFTS_KEY = 'cms.submission_drafts';
const ATTACHMENTS_KEY = 'cms.submission_attachments';
const FILES_KEY = 'cms.manuscript_files';

let failureMode = false;
let cachedManuscripts = null;
let cachedDrafts = null;
let cachedAttachments = null;
let cachedFiles = null;

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

function loadAttachments() {
  if (cachedAttachments) {
    return cachedAttachments;
  }
  const raw = localStorage.getItem(ATTACHMENTS_KEY);
  cachedAttachments = raw ? JSON.parse(raw) : {};
  return cachedAttachments;
}

function persistAttachments(attachments) {
  if (failureMode) {
    throw new Error('storage_failure');
  }
  localStorage.setItem(ATTACHMENTS_KEY, JSON.stringify(attachments));
  cachedAttachments = attachments;
}

function loadFiles() {
  if (cachedFiles) {
    return cachedFiles;
  }
  const raw = localStorage.getItem(FILES_KEY);
  cachedFiles = raw ? JSON.parse(raw) : {};
  return cachedFiles;
}

function persistFiles(files) {
  if (failureMode) {
    throw new Error('storage_failure');
  }
  localStorage.setItem(FILES_KEY, JSON.stringify(files));
  cachedFiles = files;
}

export const submissionStorage = {
  setFailureMode(enabled) {
    failureMode = Boolean(enabled);
  },
  reset() {
    failureMode = false;
    cachedManuscripts = null;
    cachedDrafts = null;
    cachedAttachments = null;
    cachedFiles = null;
    localStorage.removeItem(MANUSCRIPTS_KEY);
    localStorage.removeItem(DRAFTS_KEY);
    localStorage.removeItem(ATTACHMENTS_KEY);
    localStorage.removeItem(FILES_KEY);
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
  saveManuscriptFile(fileRecord) {
    const files = { ...loadFiles() };
    files[fileRecord.id] = fileRecord;
    persistFiles(files);
  },
  getManuscriptFile(fileId) {
    const files = loadFiles();
    return files[fileId] || null;
  },
  removeManuscriptFile(fileId) {
    const files = { ...loadFiles() };
    if (files[fileId]) {
      delete files[fileId];
      persistFiles(files);
    }
  },
  attachFile(userKey, fileId) {
    const attachments = { ...loadAttachments() };
    attachments[userKey] = {
      manuscriptFileId: fileId,
      attachedAt: new Date().toISOString(),
    };
    persistAttachments(attachments);
  },
  getAttachment(userKey) {
    const attachments = loadAttachments();
    const entry = attachments[userKey];
    if (!entry) {
      return null;
    }
    const file = loadFiles()[entry.manuscriptFileId] || null;
    return { ...entry, file };
  },
  clearAttachment(userKey) {
    const attachments = { ...loadAttachments() };
    if (attachments[userKey]) {
      delete attachments[userKey];
      persistAttachments(attachments);
    }
  },
  getAllFiles() {
    return { ...loadFiles() };
  },
};
