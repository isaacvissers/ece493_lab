import { UI_MESSAGES } from '../../src/services/ui-messages.js';

test('required error provides field details', () => {
  const emailRequired = UI_MESSAGES.errors.required('email');
  expect(emailRequired.field).toBe('email');
  expect(emailRequired.message).toContain('email');
  const passwordRequired = UI_MESSAGES.errors.required('password');
  expect(passwordRequired.field).toBe('password');
});

test('includes login error copy', () => {
  expect(UI_MESSAGES.errors.invalidCredentials.message).toContain('Invalid');
  expect(UI_MESSAGES.errors.loginUnavailable.message).toContain('unavailable');
  expect(UI_MESSAGES.errors.accessDenied.message).toContain('log in');
});

test('success copy present', () => {
  expect(UI_MESSAGES.success.title).toContain('Login');
  expect(UI_MESSAGES.success.body).toContain('home');
});
