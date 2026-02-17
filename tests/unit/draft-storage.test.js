import { draftStorage } from '../../src/services/draft-storage.js';

test('saves, loads, and overwrites drafts', () => {
  draftStorage.reset();
  expect(draftStorage.loadDraft('user@example.com')).toBeNull();
  draftStorage.saveDraft('user@example.com', { id: 'draft_1', draftData: { title: 'First' } });
  expect(draftStorage.loadDraft('user@example.com').id).toBe('draft_1');
  draftStorage.saveDraft('user@example.com', { id: 'draft_2', draftData: { title: 'Second' } });
  expect(draftStorage.loadDraft('user@example.com').id).toBe('draft_2');
  expect(draftStorage.loadDraft('user@example.com').id).toBe('draft_2');
});

test('clears drafts when requested', () => {
  draftStorage.reset();
  draftStorage.saveDraft('user@example.com', { id: 'draft_1', draftData: { title: 'First' } });
  draftStorage.clearDraft('user@example.com');
  expect(draftStorage.loadDraft('user@example.com')).toBeNull();
});

test('clearDraft is safe when no draft exists', () => {
  draftStorage.reset();
  draftStorage.clearDraft('missing@example.com');
  expect(draftStorage.loadDraft('missing@example.com')).toBeNull();
});

test('save failure does not overwrite existing draft', () => {
  draftStorage.reset();
  draftStorage.saveDraft('user@example.com', { id: 'draft_1', draftData: { title: 'First' } });
  draftStorage.setSaveFailureMode(true);
  expect(() => draftStorage.saveDraft('user@example.com', { id: 'draft_2', draftData: { title: 'Second' } }))
    .toThrow('draft_save_failure');
  draftStorage.setSaveFailureMode(false);
  expect(draftStorage.loadDraft('user@example.com').id).toBe('draft_1');
});

test('load failure throws without clearing draft cache', () => {
  draftStorage.reset();
  draftStorage.saveDraft('user@example.com', { id: 'draft_1', draftData: { title: 'First' } });
  draftStorage.setLoadFailureMode(true);
  expect(() => draftStorage.loadDraft('user@example.com')).toThrow('draft_load_failure');
  draftStorage.setLoadFailureMode(false);
  expect(draftStorage.loadDraft('user@example.com').id).toBe('draft_1');
});

test('loads drafts from persisted storage when cache is empty', () => {
  draftStorage.reset();
  localStorage.setItem('cms.submission_drafts', JSON.stringify({
    'user@example.com': { id: 'draft_3', draftData: { title: 'Stored' } },
  }));
  const draft = draftStorage.loadDraft('user@example.com');
  expect(draft.id).toBe('draft_3');
});
