import { createLoginView } from '../../src/views/login-view.js';
import { createLoginController } from '../../src/controllers/login-controller.js';
import { storageService } from '../../src/services/storage-service.js';
import { sessionState } from '../../src/models/session-state.js';
import { loginLogging } from '../../src/services/login-logging.js';

function setupIntegration() {
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

test('successful login authenticates and shows success', () => {
  storageService.reset();
  storageService.saveAccount({
    id: 'acct_1',
    email: 'user@example.com',
    normalizedEmail: 'user@example.com',
    password: 'validPass1!',
    createdAt: new Date().toISOString(),
  });
  const { view } = setupIntegration();
  submit(view, 'user@example.com', 'validPass1!');
  expect(sessionState.isAuthenticated()).toBe(true);
  expect(view.element.querySelector('.status').textContent).toContain('Login successful');
});

test('invalid credentials stay unauthenticated', () => {
  storageService.reset();
  const { view } = setupIntegration();
  submit(view, 'missing@example.com', 'bad');
  expect(sessionState.isAuthenticated()).toBe(false);
  expect(view.element.querySelector('.status').textContent).toContain('Invalid');
});

test('lookup failure logs and reports unavailable', () => {
  storageService.reset();
  storageService.setFailureMode(true);
  const { view } = setupIntegration();
  submit(view, 'user@example.com', 'validPass1!');
  expect(view.element.querySelector('.status').textContent).toContain('unavailable');
  expect(loginLogging.getFailures().length).toBe(1);
  storageService.setFailureMode(false);
});
