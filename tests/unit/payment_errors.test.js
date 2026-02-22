import { createError, okResult, failResult, ERROR_CODES } from '../../src/services/payment_errors.js';

test('payment errors build helpers', () => {
  const error = createError(ERROR_CODES.validation, 'invalid');
  expect(error.code).toBe(ERROR_CODES.validation);
  const ok = okResult({ value: 1 });
  expect(ok.ok).toBe(true);
  const fail = failResult('failed');
  expect(fail.ok).toBe(false);
});

test('payment errors default arguments', () => {
  const error = createError('code', 'message');
  const ok = okResult();
  const fail = failResult('reason');
  expect(error.details).toBe(null);
  expect(ok.ok).toBe(true);
  expect(fail.details).toBe(null);
});
