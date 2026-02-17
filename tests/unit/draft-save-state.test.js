import { createDraftSaveState } from '../../src/models/draft-save-state.js';

test('createDraftSaveState uses provided timestamp', () => {
  const state = createDraftSaveState('sub_1', '2026-02-02T10:00:00.000Z');
  expect(state.submissionId).toBe('sub_1');
  expect(state.lastSavedAt).toBe('2026-02-02T10:00:00.000Z');
});

test('createDraftSaveState defaults timestamp when omitted', () => {
  const state = createDraftSaveState('sub_2');
  expect(state.submissionId).toBe('sub_2');
  expect(state.lastSavedAt).toContain('T');
});
