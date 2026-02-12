import { validationService } from '../../src/services/validation-service.js';

test('normalizes email whitespace', () => {
  expect(validationService.normalizeEmail('  test@example.com ')).toBe('test@example.com');
});

test('validates email format cases', () => {
  expect(validationService.isEmailValid('user@example.com')).toBe(true);
  expect(validationService.isEmailValid('user@sub.example.com')).toBe(true);
  expect(validationService.isEmailValid('invalid')).toBe(false);
  expect(validationService.isEmailValid('no-domain@')).toBe(false);
  expect(validationService.isEmailValid('@no-local.com')).toBe(false);
  expect(validationService.isEmailValid('double@@example.com')).toBe(false);
  expect(validationService.isEmailValid('bad!local@example.com')).toBe(false);
  expect(validationService.isEmailValid('nodot@domain')).toBe(false);
  expect(validationService.isEmailValid('dot@domain.')).toBe(false);
});

test('password trims whitespace before validation', () => {
  const result = validationService.isPasswordValid('  valid1!a  ');
  expect(result.ok).toBe(true);
});

test('password too short fails', () => {
  const result = validationService.isPasswordValid('a1!b');
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('too_short');
});

test('empty password fails', () => {
  const result = validationService.isPasswordValid('   ');
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('too_short');
});

test('null password fails', () => {
  const result = validationService.isPasswordValid(null);
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('too_short');
});

test('password requires number and symbol', () => {
  const result = validationService.isPasswordValid('password!');
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('complexity');
});

test('password rejects disallowed content', () => {
  const result = validationService.isPasswordValid('valid 1!a');
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('disallowed');
});

test('password passes when compliant', () => {
  const result = validationService.isPasswordValid('valid1!a');
  expect(result.ok).toBe(true);
});

test('policy retrieval failure throws', () => {
  validationService.setPolicyAvailable(false);
  expect(() => validationService.getPasswordPolicy()).toThrow('policy_unavailable');
  validationService.setPolicyAvailable(true);
});

test('returns password policy when available', () => {
  const policy = validationService.getPasswordPolicy();
  expect(policy.minLength).toBe(8);
  expect(policy.requireNumber).toBe(true);
  expect(policy.requireSymbol).toBe(true);
});

test('logs password failure', () => {
  localStorage.clear();
  validationService.logPasswordFailure('complexity', 'acct_1');
  validationService.logPasswordFailure('disallowed');
  const raw = localStorage.getItem('cms.password_validation_log');
  const log = JSON.parse(raw || '[]');
  expect(log.length).toBe(2);
  expect(log[0].type).toBe('complexity');
  expect(log[0].userId).toBe('acct_1');
  expect(log[1].userId).toBeNull();
});
