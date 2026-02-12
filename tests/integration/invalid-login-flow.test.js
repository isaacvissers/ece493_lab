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

test('invalid credentials reject login and allow retry', () => {
  const { view } = setupIntegration();
  submit(view, 'missing@example.com', 'wrongPass');
  const firstStatus = view.element.querySelector('.status').textContent;
  expect(firstStatus).toContain('Invalid email or password.');
  expect(sessionState.isAuthenticated()).toBe(false);

  storageService.saveAccount({
    id: 'acct_1',
    email: 'user@example.com',
    normalizedEmail: 'user@example.com',
    password: 'validPass1!',
    createdAt: new Date().toISOString(),
  });
  submit(view, 'user@example.com', 'validPass1!');
  expect(sessionState.isAuthenticated()).toBe(true);
});

test('invalid credentials do not authenticate and log failure', () => {
  const { view } = setupIntegration();
  submit(view, 'missing@example.com', 'wrongPass');
  expect(sessionState.isAuthenticated()).toBe(false);
  expect(view.element.querySelector('.status').textContent).toContain('Invalid email or password.');
  const failures = loginLogging.getFailures();
  expect(failures.length).toBe(1);
  expect(failures[0].failureType).toBe('invalid_credentials');
});

test('lookup failure shows unavailable and logs', () => {
  const originalFindByEmail = storageService.findByEmail;
  storageService.findByEmail = () => {
    throw new Error('lookup_failed');
  };
  const { view } = setupIntegration();
  submit(view, 'user@example.com', 'validPass1!');
  expect(view.element.querySelector('.status').textContent).toContain('unavailable');
  const failures = loginLogging.getFailures();
  expect(failures.length).toBe(1);
  expect(failures[0].failureType).toBe('lookup_failure');
  storageService.findByEmail = originalFindByEmail;
});
