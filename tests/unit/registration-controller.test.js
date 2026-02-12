import { jest } from '@jest/globals';
import { createRegistrationView } from '../../src/views/registration-view.js';
import { createRegistrationController } from '../../src/controllers/registration-controller.js';
import { UI_MESSAGES } from '../../src/services/ui-messages.js';
import { validationService } from '../../src/services/validation-service.js';

function createMocks() {
  return {
    storage: {
      logValidationFailure: jest.fn(),
      findByEmail: jest.fn(() => null),
      saveAccount: jest.fn(),
    },
    sessionState: {
      ensureLoggedOut: jest.fn(() => true),
    },
    redirectLogger: {
      logFailure: jest.fn(),
    },
  };
}

function setupController(overrides = {}) {
  const view = createRegistrationView();
  document.body.appendChild(view.element);
  const mocks = createMocks();
  let redirectTarget = null;
  const controller = createRegistrationController({
    view,
    storage: overrides.storage || mocks.storage,
    sessionState: overrides.sessionState || mocks.sessionState,
    redirectLogger: overrides.redirectLogger || mocks.redirectLogger,
    redirectToLogin: overrides.redirectToLogin || ((target) => {
      redirectTarget = target;
    }),
  });
  controller.init();
  return { view, getRedirectTarget: () => redirectTarget, mocks };
}

function submitForm(view, email, password) {
  view.element.querySelector('#email').value = email;
  view.element.querySelector('#password').value = password;
  const event = new Event('submit', { bubbles: true, cancelable: true });
  view.element.querySelector('form').dispatchEvent(event);
}

const originalGetPasswordPolicy = validationService.getPasswordPolicy;
const originalIsPasswordValid = validationService.isPasswordValid;
const originalIsEmailValid = validationService.isEmailValid;

afterEach(() => {
  validationService.getPasswordPolicy = originalGetPasswordPolicy;
  validationService.isPasswordValid = originalIsPasswordValid;
  validationService.isEmailValid = originalIsEmailValid;
  jest.useRealTimers();
});

test('redirects to login after success', () => {
  jest.useFakeTimers();
  const { view, getRedirectTarget } = setupController();
  submitForm(view, 'valid@example.com', 'valid1!a');
  jest.runAllTimers();
  expect(getRedirectTarget()).toBe('/login');
});

test('redirect failure shows error', () => {
  jest.useFakeTimers();
  const { view } = setupController({
    redirectToLogin: () => {
      throw new Error('redirect_failed');
    },
    redirectLogger: {
      logFailure() {},
    },
  });
  submitForm(view, 'valid@example.com', 'valid1!a');
  jest.runAllTimers();
  const status = view.element.querySelector('.status').textContent;
  expect(status).toContain('redirect');
});

test('requires email before submit', () => {
  const { view, mocks } = setupController();
  submitForm(view, '', 'valid1!a');
  const emailError = view.element.querySelector('#email-error').textContent;
  expect(emailError).toContain(UI_MESSAGES.errors.required('email').message);
  expect(mocks.storage.logValidationFailure).toHaveBeenCalledWith({
    type: 'required',
    field: 'email',
  });
});

test('requires password before submit', () => {
  const { view, mocks } = setupController();
  submitForm(view, 'valid@example.com', '');
  const passwordError = view.element.querySelector('#password-error').textContent;
  expect(passwordError).toContain(UI_MESSAGES.errors.required('password').message);
  expect(mocks.storage.logValidationFailure).toHaveBeenCalledWith({
    type: 'required',
    field: 'password',
  });
});

test('rejects invalid email format', () => {
  const { view, mocks } = setupController();
  submitForm(view, 'invalid', 'valid1!a');
  const emailError = view.element.querySelector('#email-error').textContent;
  expect(emailError).toContain(UI_MESSAGES.errors.emailFormat.message);
  expect(mocks.storage.logValidationFailure).toHaveBeenCalledWith({
    type: 'format',
    field: 'email',
  });
});

test('handles password policy unavailable', () => {
  validationService.getPasswordPolicy = () => {
    throw new Error('policy_unavailable');
  };
  const { view } = setupController();
  submitForm(view, 'valid@example.com', 'valid1!a');
  const passwordError = view.element.querySelector('#password-error').textContent;
  expect(passwordError).toContain(UI_MESSAGES.errors.passwordUnavailable.message);
});

test('rejects too-short password', () => {
  const { view } = setupController();
  submitForm(view, 'valid@example.com', '1!a');
  const passwordError = view.element.querySelector('#password-error').textContent;
  expect(passwordError).toContain(UI_MESSAGES.errors.passwordTooShort.message);
});

test('rejects password missing complexity', () => {
  const { view } = setupController();
  submitForm(view, 'valid@example.com', 'password');
  const passwordError = view.element.querySelector('#password-error').textContent;
  expect(passwordError).toContain(UI_MESSAGES.errors.passwordComplexity.message);
});

test('rejects disallowed password content', () => {
  const { view } = setupController();
  submitForm(view, 'valid@example.com', 'valid1! a');
  const passwordError = view.element.querySelector('#password-error').textContent;
  expect(passwordError).toContain(UI_MESSAGES.errors.passwordDisallowed.message);
});

test('rejects duplicate email', () => {
  const storage = createMocks().storage;
  storage.findByEmail = jest.fn(() => ({ id: 'acct_1' }));
  const { view } = setupController({ storage });
  submitForm(view, 'valid@example.com', 'valid1!a');
  const emailError = view.element.querySelector('#email-error').textContent;
  expect(emailError).toContain(UI_MESSAGES.errors.emailDuplicate.message);
  expect(storage.findByEmail).toHaveBeenCalled();
});

test('maps unknown password reason to complexity error', () => {
  validationService.isPasswordValid = () => ({ ok: false, reason: 'unknown_reason' });
  const { view } = setupController();
  submitForm(view, 'valid@example.com', 'valid1!a');
  const passwordError = view.element.querySelector('#password-error').textContent;
  expect(passwordError).toContain(UI_MESSAGES.errors.passwordComplexity.message);
});

test('maps password_invalid from account creation to complexity error', () => {
  let calls = 0;
  validationService.isPasswordValid = () => {
    calls += 1;
    if (calls === 1) {
      return { ok: true };
    }
    return { ok: false, reason: 'complexity' };
  };
  const { view } = setupController();
  submitForm(view, 'valid@example.com', 'valid1!a');
  const passwordError = view.element.querySelector('#password-error').textContent;
  expect(passwordError).toContain(UI_MESSAGES.errors.passwordComplexity.message);
});

test('maps non-password account errors to email error', () => {
  let calls = 0;
  validationService.isEmailValid = () => {
    calls += 1;
    return calls === 1;
  };
  const { view } = setupController();
  submitForm(view, 'VALID@EXAMPLE.COM', 'valid1!a');
  const emailError = view.element.querySelector('#email-error').textContent;
  expect(emailError).toContain(UI_MESSAGES.errors.emailFormat.message);
});

test('shows storage failure status', () => {
  const storage = createMocks().storage;
  storage.saveAccount = jest.fn(() => {
    throw new Error('storage_failure');
  });
  const { view } = setupController({ storage });
  submitForm(view, 'valid@example.com', 'valid1!a');
  const status = view.element.querySelector('.status').textContent;
  expect(status).toContain(UI_MESSAGES.errors.storageFailure.message);
});
