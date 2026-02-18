const DRAFTS_KEY = 'cms.review_validation_drafts';
const SUBMISSIONS_KEY = 'cms.review_validation_submissions';

let failureMode = false;

function loadItems(key) {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : [];
}

function persistItems(key, items) {
  if (failureMode) {
    throw new Error('review_storage_failure');
  }
  localStorage.setItem(key, JSON.stringify(items));
}

export const reviewStorageService = {
  setFailureMode(enabled) {
    failureMode = Boolean(enabled);
  },
  reset() {
    failureMode = false;
    localStorage.removeItem(DRAFTS_KEY);
    localStorage.removeItem(SUBMISSIONS_KEY);
  },
  saveDraft({ formId, reviewerEmail, content, errors } = {}) {
    const drafts = loadItems(DRAFTS_KEY);
    drafts.push({
      formId,
      reviewerEmail,
      content,
      errors: errors || null,
      savedAt: new Date().toISOString(),
    });
    persistItems(DRAFTS_KEY, drafts);
    return { ok: true };
  },
  submitReview({ formId, reviewerEmail, content } = {}) {
    const submissions = loadItems(SUBMISSIONS_KEY);
    submissions.push({
      formId,
      reviewerEmail,
      content,
      submittedAt: new Date().toISOString(),
    });
    persistItems(SUBMISSIONS_KEY, submissions);
    return { ok: true };
  },
};
