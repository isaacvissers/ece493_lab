import {
  createDraft,
  createDraftSubmission,
  getDraftWarnings,
  restoreDraft,
} from '../../src/models/draft-submission.js';

const baseValues = {
  title: 'Draft title',
  authorNames: 'Author One',
  affiliations: 'Institute',
  contactEmail: 'draft@example.com',
  abstract: 'Abstract',
  keywords: 'draft, test',
  mainSource: 'Source',
};

test('createDraft stores partial metadata and file reference', () => {
  const draft = createDraft(baseValues, { originalName: 'draft.pdf', fileType: 'pdf', fileSizeBytes: 100 });
  expect(draft.id).toContain('draft_');
  expect(draft.draftData.title).toBe('Draft title');
  expect(draft.draftFileMetadata.originalName).toBe('draft.pdf');
});

test('createDraft allows missing required fields', () => {
  const draft = createDraft({}, null);
  expect(draft.draftData.title).toBe('');
  expect(draft.draftData.contactEmail).toBe('');
});

test('getDraftWarnings lists missing required fields', () => {
  const warnings = getDraftWarnings({ title: 'Draft title', contactEmail: '' });
  expect(warnings).toContain('contactEmail');
  expect(warnings).toContain('authorNames');
});

test('getDraftWarnings returns empty when fields present', () => {
  const warnings = getDraftWarnings(baseValues);
  expect(warnings).toEqual([]);
});

test('restoreDraft returns null when draft missing', () => {
  expect(restoreDraft(null)).toBe(null);
});

test('restoreDraft returns data with file meta when present', () => {
  const draft = createDraft(baseValues, { originalName: 'draft.pdf', fileType: 'pdf', fileSizeBytes: 100 });
  const restored = restoreDraft(draft);
  expect(restored.title).toBe('Draft title');
  expect(restored.fileMeta.originalName).toBe('draft.pdf');
});

test('restoreDraft handles missing file metadata', () => {
  const draft = createDraft(baseValues, null);
  const restored = restoreDraft(draft);
  expect(restored.fileMeta).toBe(null);
});

test('createDraftSubmission captures values and file', () => {
  const file = new File(['content'], 'paper.pdf', { type: 'application/pdf' });
  const submission = createDraftSubmission({ title: 'Draft' }, file);
  expect(submission.values.title).toBe('Draft');
  expect(submission.file.name).toBe('paper.pdf');
});
