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
  expect(UI_MESSAGES.loginSuccess.title).toContain('Login');
  expect(UI_MESSAGES.loginSuccess.body).toContain('home');
  expect(UI_MESSAGES.registrationSuccess.title).toContain('Registration');
  expect(UI_MESSAGES.registrationSuccess.body).toContain('Signing you in');
  expect(UI_MESSAGES.changePasswordSuccess.title).toContain('Password');
  expect(UI_MESSAGES.submissionSuccess.title).toContain('Submission');
  expect(UI_MESSAGES.draftSaved.body).toContain('draft');
});

test('change-password errors included', () => {
  expect(UI_MESSAGES.errors.currentPasswordIncorrect.message).toContain('Current password');
  expect(UI_MESSAGES.errors.passwordMismatch.message).toContain('match');
  expect(UI_MESSAGES.errors.passwordChangeUnavailable.message).toContain('unavailable');
});

test('submission errors included', () => {
  expect(UI_MESSAGES.errors.fileTypeInvalid.message).toContain('PDF');
  expect(UI_MESSAGES.errors.fileTooLarge.message).toContain('7MB');
  expect(UI_MESSAGES.errors.submissionUnavailable.message).toContain('Submission');
});
