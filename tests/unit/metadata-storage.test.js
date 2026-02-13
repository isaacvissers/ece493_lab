import { metadataStorage } from '../../src/services/metadata-storage.js';

test('saves and loads metadata', () => {
  metadataStorage.reset();
  const metadata = { submissionId: 'sub_1', authorNames: 'Author', updatedAt: new Date().toISOString() };
  metadataStorage.saveMetadata('user@example.com', metadata);
  const loaded = metadataStorage.loadMetadata('user@example.com');
  expect(loaded.metadata.submissionId).toBe('sub_1');
  expect(metadataStorage.isFinalized('user@example.com')).toBe(true);
});

test('saves and loads metadata drafts', () => {
  metadataStorage.reset();
  metadataStorage.saveDraft('user2@example.com', { submissionId: 'sub_2', draftData: { authorNames: 'Draft' } });
  const draft = metadataStorage.loadDraft('user2@example.com');
  expect(draft.draftData.authorNames).toBe('Draft');
  metadataStorage.clearDraft('user2@example.com');
  expect(metadataStorage.loadDraft('user2@example.com')).toBeNull();
});

test('failure mode throws on writes', () => {
  metadataStorage.reset();
  metadataStorage.setFailureMode(true);
  expect(() => metadataStorage.saveMetadata('user3@example.com', { submissionId: 'sub_3' }))
    .toThrow('storage_failure');
  expect(() => metadataStorage.saveDraft('user3@example.com', { submissionId: 'sub_3' }))
    .toThrow('storage_failure');
  metadataStorage.setFailureMode(false);
});

test('loads from persisted storage when cache empty', () => {
  metadataStorage.reset();
  localStorage.setItem('cms.metadata_store', JSON.stringify({
    'user4@example.com': { metadata: { submissionId: 'sub_4' }, finalized: true },
  }));
  const loaded = metadataStorage.loadMetadata('user4@example.com');
  expect(loaded.metadata.submissionId).toBe('sub_4');
});

test('uses cached metadata on repeated load', () => {
  metadataStorage.reset();
  metadataStorage.saveMetadata('user5@example.com', { submissionId: 'sub_5' });
  const first = metadataStorage.loadMetadata('user5@example.com');
  const second = metadataStorage.loadMetadata('user5@example.com');
  expect(second).toBe(first);
});

test('loads drafts from persisted storage when cache empty', () => {
  metadataStorage.reset();
  localStorage.setItem('cms.metadata_drafts', JSON.stringify({
    'user6@example.com': { submissionId: 'sub_6', draftData: { authorNames: 'Draft' } },
  }));
  const draft = metadataStorage.loadDraft('user6@example.com');
  expect(draft.submissionId).toBe('sub_6');
});
