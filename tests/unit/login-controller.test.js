import { jest } from '@jest/globals';
import { createLoginView } from '../../src/views/login-view.js';
import { createLoginController } from '../../src/controllers/login-controller.js';
import { UI_MESSAGES } from '../../src/services/ui-messages.js';

function setupController(overrides = {}) {
  const view = createLoginView();
  document.body.appendChild(view.element);
  const defaultSessionState = {
    authenticate: jest.fn(),
    isAuthenticated: jest.fn(() => false),
    getCurrentUser: jest.fn(() => null),
  };
  const defaultStorage = {
    findByEmail: jest.fn(() => null),
    normalizeEmail: (value) => (value || '').trim().toLowerCase(),
  };
  const defaultLoginLogger = {
    logFailure: jest.fn(),
  };
  const storage = overrides.storage || defaultStorage;
  const sessionState = overrides.sessionState || defaultSessionState;
  const loginLogger = overrides.loginLogger || defaultLoginLogger;
  const onLoginSuccess = overrides.onLoginSuccess !== undefined
    ? overrides.onLoginSuccess
    : jest.fn();
  const controller = createLoginController({
    view,
    storage,
    sessionState,
    loginLogger,
    onLoginSuccess,
  });
  controller.init();
  return { view, controller, sessionState, storage, loginLogger, onLoginSuccess };
}

function submitForm(view, email, password) {
  view.element.querySelector('#login-email').value = email;
  view.element.querySelector('#login-password').value = password;
  const event = new Event('submit', { bubbles: true, cancelable: true });
  view.element.querySelector('form').dispatchEvent(event);
}

test('requires email before login', () => {
  const { view } = setupController();
  submitForm(view, '', 'validPass1!');
  const error = view.element.querySelector('#login-email-error').textContent;
  expect(error).toContain(UI_MESSAGES.errors.required('email').message);
});

test('requires password before login', () => {
  const { view } = setupController();
  submitForm(view, 'user@example.com', '');
  const error = view.element.querySelector('#login-password-error').textContent;
  expect(error).toContain(UI_MESSAGES.errors.required('password').message);
});

test('rejects invalid credentials', () => {
  const { view } = setupController();
  submitForm(view, 'user@example.com', 'wrong');
  const status = view.element.querySelector('.status').textContent;
  expect(status).toContain(UI_MESSAGES.errors.invalidCredentials.message);
});

test('rejects wrong password', () => {
  const { view, storage } = setupController({
    storage: {
      findByEmail: jest.fn(() => ({ email: 'user@example.com', password: 'correct' })),
      normalizeEmail: (value) => (value || '').trim().toLowerCase(),
    },
  });
  submitForm(view, 'user@example.com', 'wrong');
  const status = view.element.querySelector('.status').textContent;
  expect(status).toContain(UI_MESSAGES.errors.invalidCredentials.message);
  expect(storage.findByEmail).toHaveBeenCalled();
});

test('logs and reports lookup failure', () => {
  const storage = {
    findByEmail: jest.fn(() => {
      throw new Error('lookup_failed');
    }),
    normalizeEmail: (value) => (value || '').trim().toLowerCase(),
  };
  const loginLogger = { logFailure: jest.fn() };
  const { view } = setupController({ storage, loginLogger });
  submitForm(view, 'user@example.com', 'validPass1!');
  const status = view.element.querySelector('.status').textContent;
  expect(status).toContain(UI_MESSAGES.errors.loginUnavailable.message);
  expect(loginLogger.logFailure).toHaveBeenCalledWith({
    identifier: 'user@example.com',
    error: 'lookup_failed',
  });
});

test('authenticates and redirects on success', () => {
  const { view, sessionState, onLoginSuccess } = setupController({
    storage: {
      findByEmail: jest.fn(() => ({ email: 'user@example.com', password: 'validPass1!' })),
      normalizeEmail: (value) => (value || '').trim().toLowerCase(),
    },
  });
  submitForm(view, 'user@example.com', 'validPass1!');
  const status = view.element.querySelector('.status').textContent;
  expect(status).toContain(UI_MESSAGES.loginSuccess.title);
  expect(sessionState.authenticate).toHaveBeenCalled();
  expect(onLoginSuccess).toHaveBeenCalled();
});

test('does not require onLoginSuccess callback', () => {
  const { view, sessionState } = setupController({
    onLoginSuccess: null,
    storage: {
      findByEmail: jest.fn(() => ({ email: 'user@example.com', password: 'validPass1!' })),
      normalizeEmail: (value) => (value || '').trim().toLowerCase(),
    },
  });
  submitForm(view, 'user@example.com', 'validPass1!');
  expect(sessionState.authenticate).toHaveBeenCalled();
});

test('guards protected access when unauthenticated', () => {
  const { view, controller } = setupController();
  const allowed = controller.requireAuth();
  const status = view.element.querySelector('.status').textContent;
  expect(allowed).toBe(false);
  expect(status).toContain(UI_MESSAGES.errors.accessDenied.message);
});

test('allows protected access when authenticated', () => {
  const sessionState = {
    authenticate: jest.fn(),
    isAuthenticated: jest.fn(() => true),
    getCurrentUser: jest.fn(() => ({ email: 'user@example.com' })),
  };
  const { controller } = setupController({ sessionState });
  expect(controller.requireAuth()).toBe(true);
});
