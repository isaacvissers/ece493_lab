import { jest } from '@jest/globals';
import { createAccountSettingsView } from '../../src/views/account-settings-view.js';
import { createAccountController } from '../../src/controllers/account-controller.js';
import { UI_MESSAGES } from '../../src/services/ui-messages.js';
import { validationService } from '../../src/services/validation-service.js';

function createMocks() {
  return {
    storage: {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      updateAccount: jest.fn(),
    },
    sessionState: {
      isAuthenticated: jest.fn(() => true),
      getCurrentUser: jest.fn(() => ({ id: 'acct_1', email: 'user@example.com' })),
    },
    passwordLogger: {
      logFailure: jest.fn(),
    },
  };
}

function setupController(overrides = {}) {
  const view = createAccountSettingsView();
  document.body.appendChild(view.element);
  const mocks = createMocks();
  const onPasswordChanged = overrides.onPasswordChanged !== undefined
    ? overrides.onPasswordChanged
    : jest.fn();
  const controller = createAccountController({
    view,
    storage: overrides.storage || mocks.storage,
    sessionState: overrides.sessionState || mocks.sessionState,
    passwordLogger: overrides.passwordLogger || mocks.passwordLogger,
    onPasswordChanged,
  });
  controller.init();
  return { view, mocks, controller, onPasswordChanged };
}

function submitForm(view, currentPassword, newPassword, confirmPassword) {
  view.element.querySelector('#current-password').value = currentPassword;
  view.element.querySelector('#new-password').value = newPassword;
  view.element.querySelector('#confirm-password').value = confirmPassword;
  const event = new Event('submit', { bubbles: true, cancelable: true });
  view.element.querySelector('form').dispatchEvent(event);
}

const originalGetPasswordPolicy = validationService.getPasswordPolicy;
const originalIsPasswordValid = validationService.isPasswordValid;

afterEach(() => {
  validationService.getPasswordPolicy = originalGetPasswordPolicy;
  validationService.isPasswordValid = originalIsPasswordValid;
});

test('requires all fields before submit', () => {
  const { view } = setupController();
  submitForm(view, '', '', '');
  expect(view.element.querySelector('#current-password-error').textContent)
    .toContain(UI_MESSAGES.errors.required('current password').message);
  expect(view.element.querySelector('#new-password-error').textContent)
    .toContain(UI_MESSAGES.errors.required('new password').message);
  expect(view.element.querySelector('#confirm-password-error').textContent)
    .toContain(UI_MESSAGES.errors.required('confirmation').message);
});

test('rejects incorrect current password', () => {
  const storage = createMocks().storage;
  storage.findByEmail = jest.fn(() => ({ id: 'acct_1', email: 'user@example.com', password: 'oldPass1!' }));
  const { view } = setupController({ storage });
  submitForm(view, 'wrongPass', 'valid1!a', 'valid1!a');
  expect(view.element.querySelector('#current-password-error').textContent)
    .toContain(UI_MESSAGES.errors.currentPasswordIncorrect.message);
});

test('rejects mismatched confirmation', () => {
  const storage = createMocks().storage;
  storage.findByEmail = jest.fn(() => ({ id: 'acct_1', email: 'user@example.com', password: 'oldPass1!' }));
  const { view } = setupController({ storage });
  submitForm(view, 'oldPass1!', 'valid1!a', 'different');
  expect(view.element.querySelector('#confirm-password-error').textContent)
    .toContain(UI_MESSAGES.errors.passwordMismatch.message);
});

test('rejects policy violations', () => {
  const storage = createMocks().storage;
  storage.findByEmail = jest.fn(() => ({ id: 'acct_1', email: 'user@example.com', password: 'oldPass1!' }));
  const { view } = setupController({ storage });
  submitForm(view, 'oldPass1!', 'short', 'short');
  expect(view.element.querySelector('#new-password-error').textContent)
    .toContain(UI_MESSAGES.errors.passwordTooShort.message);
});

test('rejects disallowed password content', () => {
  const storage = createMocks().storage;
  storage.findByEmail = jest.fn(() => ({ id: 'acct_1', email: 'user@example.com', password: 'oldPass1!' }));
  const { view } = setupController({ storage });
  submitForm(view, 'oldPass1!', 'valid1! a', 'valid1! a');
  expect(view.element.querySelector('#new-password-error').textContent)
    .toContain(UI_MESSAGES.errors.passwordDisallowed.message);
});

test('rejects missing complexity', () => {
  const storage = createMocks().storage;
  storage.findByEmail = jest.fn(() => ({ id: 'acct_1', email: 'user@example.com', password: 'oldPass1!' }));
  const { view } = setupController({ storage });
  submitForm(view, 'oldPass1!', 'password', 'password');
  expect(view.element.querySelector('#new-password-error').textContent)
    .toContain(UI_MESSAGES.errors.passwordComplexity.message);
});

test('handles lookup failure', () => {
  const storage = createMocks().storage;
  storage.findByEmail = jest.fn(() => {
    throw new Error('lookup_failed');
  });
  const passwordLogger = { logFailure: jest.fn() };
  const { view } = setupController({ storage, passwordLogger });
  submitForm(view, 'oldPass1!', 'valid1!a', 'valid1!a');
  expect(view.element.querySelector('.status').textContent)
    .toContain(UI_MESSAGES.errors.passwordChangeUnavailable.message);
  expect(passwordLogger.logFailure).toHaveBeenCalled();
});

test('logs lookup failure without session id', () => {
  const storage = createMocks().storage;
  storage.findByEmail = jest.fn(() => {
    throw new Error('lookup_failed');
  });
  const sessionState = {
    isAuthenticated: jest.fn(() => true),
    getCurrentUser: jest.fn(() => ({ email: 'user@example.com' })),
  };
  const passwordLogger = { logFailure: jest.fn() };
  const { view } = setupController({ storage, sessionState, passwordLogger });
  submitForm(view, 'oldPass1!', 'valid1!a', 'valid1!a');
  expect(view.element.querySelector('.status').textContent)
    .toContain(UI_MESSAGES.errors.passwordChangeUnavailable.message);
  expect(passwordLogger.logFailure).toHaveBeenCalledWith({
    userId: null,
    error: 'lookup_failed',
  });
});

test('logs and reports update failure', () => {
  const storage = createMocks().storage;
  storage.findByEmail = jest.fn(() => ({ id: 'acct_1', email: 'user@example.com', password: 'oldPass1!' }));
  storage.findById = jest.fn(() => ({ id: 'acct_1', email: 'user@example.com', password: 'oldPass1!' }));
  storage.updateAccount = jest.fn(() => {
    throw new Error('update_failed');
  });
  const passwordLogger = { logFailure: jest.fn() };
  const { view } = setupController({ storage, passwordLogger });
  submitForm(view, 'oldPass1!', 'valid1!a', 'valid1!a');
  expect(view.element.querySelector('.status').textContent)
    .toContain(UI_MESSAGES.errors.passwordChangeUnavailable.message);
  expect(passwordLogger.logFailure).toHaveBeenCalled();
});

test('uses default error when update failure has no message', () => {
  const storage = createMocks().storage;
  storage.findByEmail = jest.fn(() => ({ id: 'acct_1', email: 'user@example.com', password: 'oldPass1!' }));
  storage.findById = jest.fn(() => ({ id: 'acct_1', email: 'user@example.com', password: 'oldPass1!' }));
  storage.updateAccount = jest.fn(() => {
    throw null;
  });
  const passwordLogger = { logFailure: jest.fn() };
  const { view } = setupController({ storage, passwordLogger });
  submitForm(view, 'oldPass1!', 'valid1!a', 'valid1!a');
  expect(view.element.querySelector('.status').textContent)
    .toContain(UI_MESSAGES.errors.passwordChangeUnavailable.message);
  expect(passwordLogger.logFailure).toHaveBeenCalledWith({
    userId: 'acct_1',
    error: 'update_failed',
  });
});

test('reports missing account during update', () => {
  const storage = createMocks().storage;
  storage.findByEmail = jest.fn(() => ({ id: 'acct_1', email: 'user@example.com', password: 'oldPass1!' }));
  storage.findById = jest.fn(() => null);
  const passwordLogger = { logFailure: jest.fn() };
  const { view } = setupController({ storage, passwordLogger });
  submitForm(view, 'oldPass1!', 'valid1!a', 'valid1!a');
  expect(view.element.querySelector('.status').textContent)
    .toContain(UI_MESSAGES.errors.passwordChangeUnavailable.message);
  expect(passwordLogger.logFailure).toHaveBeenCalled();
});

test('updates password and shows success', () => {
  const storage = createMocks().storage;
  storage.findByEmail = jest.fn(() => ({ id: 'acct_1', email: 'user@example.com', password: 'oldPass1!' }));
  storage.findById = jest.fn(() => ({ id: 'acct_1', email: 'user@example.com', password: 'oldPass1!' }));
  storage.updateAccount = jest.fn((account) => account);
  const onPasswordChanged = jest.fn();
  const { view } = setupController({ storage, onPasswordChanged });
  submitForm(view, 'oldPass1!', 'valid1!a', 'valid1!a');
  expect(view.element.querySelector('.status').textContent)
    .toContain(UI_MESSAGES.changePasswordSuccess.title);
  expect(onPasswordChanged).toHaveBeenCalled();
});

test('does not require onPasswordChanged callback', () => {
  const storage = createMocks().storage;
  storage.findByEmail = jest.fn(() => ({ id: 'acct_1', email: 'user@example.com', password: 'oldPass1!' }));
  storage.findById = jest.fn(() => ({ id: 'acct_1', email: 'user@example.com', password: 'oldPass1!' }));
  storage.updateAccount = jest.fn((account) => account);
  const { view } = setupController({ storage, onPasswordChanged: null });
  submitForm(view, 'oldPass1!', 'valid1!a', 'valid1!a');
  expect(view.element.querySelector('.status').textContent)
    .toContain(UI_MESSAGES.changePasswordSuccess.title);
});

test('requireAuth blocks unauthenticated access', () => {
  const sessionState = {
    isAuthenticated: jest.fn(() => false),
    getCurrentUser: jest.fn(() => null),
  };
  const { view, controller } = setupController({ sessionState });
  expect(controller.requireAuth()).toBe(false);
  expect(view.element.querySelector('.status').textContent)
    .toContain(UI_MESSAGES.errors.accessDenied.message);
});

test('requireAuth allows authenticated access', () => {
  const sessionState = {
    isAuthenticated: jest.fn(() => true),
    getCurrentUser: jest.fn(() => ({ id: 'acct_1', email: 'user@example.com' })),
  };
  const { controller } = setupController({ sessionState });
  expect(controller.requireAuth()).toBe(true);
});

test('rejects when session user missing', () => {
  const sessionState = {
    isAuthenticated: jest.fn(() => true),
    getCurrentUser: jest.fn(() => null),
  };
  const { view } = setupController({ sessionState });
  submitForm(view, 'oldPass1!', 'valid1!a', 'valid1!a');
  expect(view.element.querySelector('.status').textContent)
    .toContain(UI_MESSAGES.errors.accessDenied.message);
});

test('handles password policy unavailable', () => {
  const storage = createMocks().storage;
  storage.findByEmail = jest.fn(() => ({ id: 'acct_1', email: 'user@example.com', password: 'oldPass1!' }));
  validationService.getPasswordPolicy = () => {
    throw new Error('policy_unavailable');
  };
  const { view } = setupController({ storage });
  submitForm(view, 'oldPass1!', 'valid1!a', 'valid1!a');
  expect(view.element.querySelector('#new-password-error').textContent)
    .toContain(UI_MESSAGES.errors.passwordUnavailable.message);
});
