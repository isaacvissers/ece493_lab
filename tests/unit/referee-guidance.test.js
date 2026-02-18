import { refereeGuidance } from '../../src/services/referee-guidance.js';

test('returns add guidance when count is below three', () => {
  const guidance = refereeGuidance.getGuidance({ count: 2 });
  expect(guidance.action).toBe('add');
  expect(guidance.message).toContain('Add');
});

test('returns remove guidance when count is above three', () => {
  const guidance = refereeGuidance.getGuidance({ count: 4 });
  expect(guidance.action).toBe('remove');
  expect(guidance.message).toContain('Remove');
});

test('returns null guidance when count is exactly three', () => {
  const guidance = refereeGuidance.getGuidance({ count: 3 });
  expect(guidance).toBeNull();
});
