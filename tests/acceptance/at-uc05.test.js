import { createLoginView } from '../../src/views/login-view.js';
import { createLoginController } from '../../src/controllers/login-controller.js';
import { storageService } from '../../src/services/storage-service.js';
import { sessionState } from '../../src/models/session-state.js';
import { loginLogging } from '../../src/services/login-logging.js';

function setupAcceptance() {
  const view = createLoginView();
  document.body.appendChild(view.element);
  const controller = createLoginController({
    view,
    storage: storageService,
    sessionState,
    loginLogger: loginLogging,
    onLoginSuccess: () => {},
  });
  controller.init();
  return { view, controller };
}

function submit(view, email, password) {
  view.element.querySelector('#login-email').value = email;
  view.element.querySelector('#login-password').value = password;
  const event = new Event('submit', { bubbles: true, cancelable: true });
  view.element.querySelector('form').dispatchEvent(event);
}

test('login form prompts for email and password', () => {
  const { view } = setupAcceptance();
  expect(view.element.querySelector('#login-email')).toBeTruthy();
  expect(view.element.querySelector('#login-password')).toBeTruthy();
});

test('valid credentials authenticate and redirect', () => {
  storageService.reset();
  storageService.saveAccount({
    id: 'acct_1',
    email: 'user@example.com',
    normalizedEmail: 'user@example.com',
    password: 'validPass1!',
    createdAt: new Date().toISOString(),
  });
  const { view } = setupAcceptance();
  submit(view, 'user@example.com', 'validPass1!');
  expect(sessionState.isAuthenticated()).toBe(true);
});

test('missing fields show required error', () => {
  const { view } = setupAcceptance();
  submit(view, '', '');
  expect(view.element.querySelector('#login-email-error').textContent).toContain('required');
  expect(view.element.querySelector('#login-password-error').textContent).toContain('required');
});

test('non-existent email shows invalid credentials', () => {
  storageService.reset();
  const { view } = setupAcceptance();
  submit(view, 'missing@example.com', 'validPass1!');
  expect(view.element.querySelector('.status').textContent).toContain('Invalid');
});

test('incorrect password shows invalid credentials', () => {
  storageService.reset();
  storageService.saveAccount({
    id: 'acct_2',
    email: 'user2@example.com',
    normalizedEmail: 'user2@example.com',
    password: 'validPass1!',
    createdAt: new Date().toISOString(),
  });
  const { view } = setupAcceptance();
  submit(view, 'user2@example.com', 'wrongPass');
  expect(view.element.querySelector('.status').textContent).toContain('Invalid');
});

test('lookup failure shows unavailable and logs', () => {
  storageService.reset();
  storageService.setFailureMode(true);
  const { view } = setupAcceptance();
  submit(view, 'user@example.com', 'validPass1!');
  expect(view.element.querySelector('.status').textContent).toContain('unavailable');
  expect(loginLogging.getFailures().length).toBe(1);
  storageService.setFailureMode(false);
});

test('authenticated session allows protected access', () => {
  storageService.reset();
  storageService.setCurrentUser({
    id: 'acct_3',
    email: 'user3@example.com',
    createdAt: new Date().toISOString(),
  });
  const { controller } = setupAcceptance();
  expect(controller.requireAuth()).toBe(true);
});

test('unauthenticated access redirects to login', () => {
  storageService.reset();
  const { controller, view } = setupAcceptance();
  expect(controller.requireAuth()).toBe(false);
  expect(view.element.querySelector('.status').textContent).toContain('log in');
});
