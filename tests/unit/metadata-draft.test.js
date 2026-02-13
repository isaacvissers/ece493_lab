import { createMetadataDraft, restoreMetadataDraft } from '../../src/models/metadata-draft.js';

test('creates and restores metadata draft', () => {
  const draft = createMetadataDraft('sub_2', { authorNames: 'Author One' });
  expect(draft.submissionId).toBe('sub_2');
  const restored = restoreMetadataDraft(draft);
  expect(restored.authorNames).toBe('Author One');
});

test('restore returns null for invalid draft', () => {
  expect(restoreMetadataDraft(null)).toBeNull();
  expect(restoreMetadataDraft({ submissionId: 'sub_3' })).toBeNull();
});
