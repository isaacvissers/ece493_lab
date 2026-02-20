import { validateDecisionSelection } from '../../src/services/decisionSelectionValidation.js';

test('rejects missing decision selection', () => {
  const result = validateDecisionSelection('');
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('missing');
});

test('rejects invalid decision selection', () => {
  const result = validateDecisionSelection('maybe');
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('invalid');
});

test('accepts valid decision selections and normalizes', () => {
  const accept = validateDecisionSelection('Accept');
  expect(accept.ok).toBe(true);
  expect(accept.value).toBe('accept');

  const reject = validateDecisionSelection('reject');
  expect(reject.ok).toBe(true);
  expect(reject.value).toBe('reject');
});
