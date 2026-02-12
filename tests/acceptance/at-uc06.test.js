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

test('wrong password shows generic invalid credentials', () => {
  storageService.reset();
  storageService.saveAccount({
    id: 'acct_1',
    email: 'user@example.com',
    normalizedEmail: 'user@example.com',
    password: 'validPass1!',
    createdAt: new Date().toISOString(),
  });
  const { view } = setupAcceptance();
  submit(view, 'user@example.com', 'wrongPass');
  const status = view.element.querySelector('.status').textContent;
  expect(status).toContain('Invalid email or password.');
});

test('missing email shows same generic invalid credentials as wrong password', () => {
  const { view } = setupAcceptance();
  submit(view, 'missing@example.com', 'anyPass');
  const missingStatus = view.element.querySelector('.status').textContent;

  storageService.reset();
  storageService.saveAccount({
    id: 'acct_2',
    email: 'user2@example.com',
    normalizedEmail: 'user2@example.com',
    password: 'validPass1!',
    createdAt: new Date().toISOString(),
  });
  submit(view, 'user2@example.com', 'wrongPass');
  const wrongStatus = view.element.querySelector('.status').textContent;

  expect(missingStatus).toBe(wrongStatus);
});

test('invalid login keeps user unauthenticated and blocks protected access', () => {
  const { view, controller } = setupAcceptance();
  submit(view, 'missing@example.com', 'anyPass');
  expect(sessionState.isAuthenticated()).toBe(false);
  expect(controller.requireAuth()).toBe(false);
  expect(view.element.querySelector('.status').textContent).toContain('log in');
});

test('lookup failure shows unavailable and logs', () => {
  const originalFindByEmail = storageService.findByEmail;
  storageService.findByEmail = () => {
    throw new Error('lookup_failed');
  };
  const { view } = setupAcceptance();
  submit(view, 'user@example.com', 'validPass1!');
  expect(view.element.querySelector('.status').textContent).toContain('unavailable');
  expect(loginLogging.getFailures().length).toBe(1);
  storageService.findByEmail = originalFindByEmail;
});

test('sensitive error replacement uses generic error', () => {
  const originalFindByEmail = storageService.findByEmail;
  storageService.findByEmail = () => {
    throw new Error('username not found');
  };
  const { view } = setupAcceptance();
  submit(view, 'user@example.com', 'validPass1!');
  expect(view.element.querySelector('.status').textContent).toContain('Invalid email or password.');
  expect(loginLogging.getFailures().length).toBe(1);
  storageService.findByEmail = originalFindByEmail;
});
