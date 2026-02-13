import { submissionStorage } from '../../src/services/submission-storage.js';

test('saves and loads manuscripts', () => {
  submissionStorage.reset();
  expect(submissionStorage.getManuscripts()).toEqual([]);
  submissionStorage.saveSubmission({ id: 'ms_1', title: 'Paper' });
  const manuscripts = submissionStorage.getManuscripts();
  expect(manuscripts.length).toBe(1);
  expect(manuscripts[0].title).toBe('Paper');
  const cached = submissionStorage.getManuscripts();
  expect(cached.length).toBe(1);
});

test('saves, loads, and clears drafts', () => {
  submissionStorage.reset();
  expect(submissionStorage.loadDraft('user@example.com')).toBe(null);
  expect(submissionStorage.loadDraft('user@example.com')).toBe(null);
  const draft = { id: 'draft_1', draftData: { title: 'Draft' } };
  submissionStorage.saveDraft('user@example.com', draft);
  expect(submissionStorage.loadDraft('user@example.com').id).toBe('draft_1');
  expect(submissionStorage.loadDraft('user@example.com').id).toBe('draft_1');
  submissionStorage.clearDraft('user@example.com');
  expect(submissionStorage.loadDraft('user@example.com')).toBe(null);
});

test('throws when failure mode enabled', () => {
  submissionStorage.reset();
  submissionStorage.setFailureMode(true);
  expect(() => submissionStorage.saveSubmission({ id: 'ms_fail' }))
    .toThrow('storage_failure');
  expect(() => submissionStorage.saveDraft('user@example.com', { id: 'draft_fail' }))
    .toThrow('storage_failure');
  submissionStorage.setFailureMode(false);
});

test('returns cached manuscripts without touching storage', () => {
  submissionStorage.reset();
  submissionStorage.getManuscripts();
  const cached = submissionStorage.getManuscripts();
  expect(Array.isArray(cached)).toBe(true);
});

test('loads manuscripts from persisted storage when cache is empty', () => {
  submissionStorage.reset();
  localStorage.setItem('cms.manuscripts', JSON.stringify([{ id: 'ms_2', title: 'Stored' }]));
  const manuscripts = submissionStorage.getManuscripts();
  expect(manuscripts).toHaveLength(1);
  expect(manuscripts[0].id).toBe('ms_2');
});

test('loads drafts from persisted storage when cache is empty', () => {
  submissionStorage.reset();
  localStorage.setItem('cms.submission_drafts', JSON.stringify({
    'user@example.com': { id: 'draft_2', draftData: { title: 'Stored Draft' } },
  }));
  const draft = submissionStorage.loadDraft('user@example.com');
  expect(draft).not.toBeNull();
  expect(draft.id).toBe('draft_2');
});
