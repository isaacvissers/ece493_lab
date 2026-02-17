import {
  __submissionDraftModule,
  createDraft,
  getDraftWarnings,
  restoreDraft,
} from '../../src/models/submission-draft.js';

test('submission draft module exposes draft helpers', () => {
  expect(__submissionDraftModule).toBe(true);
  const draft = createDraft({ title: 'Draft', contactEmail: '' }, null);
  expect(draft.id).toContain('draft_');
  const warnings = getDraftWarnings({ title: 'Draft' });
  expect(warnings).toContain('contactEmail');
  const restored = restoreDraft(draft);
  expect(restored.title).toBe('Draft');
});
