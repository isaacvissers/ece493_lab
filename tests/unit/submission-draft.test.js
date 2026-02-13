import { createDraft, restoreDraft, validateDraft } from '../../src/models/submission-draft.js';

const baseValues = {
  title: 'Draft title',
  authorNames: 'Author One',
  affiliations: 'Institute',
  contactEmail: 'draft@example.com',
  abstract: 'Abstract',
  keywords: 'draft, test',
  mainSource: 'Source',
};

test('validates draft requires title and contact email', () => {
  const result = validateDraft({ title: '', contactEmail: '' });
  expect(result.ok).toBe(false);
  expect(result.errors.title).toBe('required');
  expect(result.errors.contactEmail).toBe('required');
});

test('valid draft passes validation', () => {
  const result = validateDraft({ title: 'Draft', contactEmail: 'draft@example.com' });
  expect(result.ok).toBe(true);
  expect(result.errors).toEqual({});
});

test('validates draft email format', () => {
  const result = validateDraft({ title: 'Draft', contactEmail: 'invalid' });
  expect(result.ok).toBe(false);
  expect(result.errors.contactEmail).toBe('invalid_email');
});

test('creates and restores draft data', () => {
  const draft = createDraft(baseValues, { originalName: 'draft.pdf', fileType: 'pdf', fileSizeBytes: 100 });
  expect(draft.id).toContain('draft_');
  const restored = restoreDraft(draft);
  expect(restored.title).toBe('Draft title');
  expect(restored.fileMeta.originalName).toBe('draft.pdf');
});

test('creates draft with missing optional fields', () => {
  const draft = createDraft({ title: 'Draft', contactEmail: 'draft@example.com' }, null);
  expect(draft.draftData.authorNames).toBe('');
  expect(draft.draftData.abstract).toBe('');
});

test('creates draft with missing required fields', () => {
  const draft = createDraft({}, null);
  expect(draft.draftData.title).toBe('');
  expect(draft.draftData.contactEmail).toBe('');
});

test('restoreDraft returns null when missing', () => {
  expect(restoreDraft(null)).toBe(null);
});

test('restoreDraft returns null when draft data missing', () => {
  expect(restoreDraft({ draftData: null })).toBe(null);
});
