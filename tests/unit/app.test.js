import { jest } from '@jest/globals';

async function setupApp() {
  jest.resetModules();
  document.body.innerHTML = '<main id="app"></main>';
  const { storageService } = await import('../../src/services/storage-service.js');
  storageService.reset();
  return { storageService };
}

test('app bootstraps login and redirects to dashboard on success', async () => {
  const { storageService } = await setupApp();
  storageService.saveAccount({
    id: 'acct_1',
    email: 'user@example.com',
    normalizedEmail: 'user@example.com',
    password: 'validPass1!',
    createdAt: new Date().toISOString(),
  });

  await import('../../src/app.js');

  const appRoot = document.getElementById('app');
  expect(appRoot.querySelector('#login-email')).toBeTruthy();
  appRoot.querySelector('#login-email').value = 'user@example.com';
  appRoot.querySelector('#login-password').value = 'validPass1!';
  const event = new Event('submit', { bubbles: true, cancelable: true });
  appRoot.querySelector('form').dispatchEvent(event);

  expect(appRoot.querySelector('h1').textContent).toContain('Dashboard');
});

test('app navigates to registration and auto-logins to dashboard', async () => {
  jest.useFakeTimers();
  await setupApp();
  await import('../../src/app.js');

  const appRoot = document.getElementById('app');
  appRoot.querySelector('#register-button').click();
  expect(appRoot.querySelector('#email')).toBeTruthy();
  expect(appRoot.querySelector('#login-button')).toBeTruthy();

  appRoot.querySelector('#email').value = 'newuser@example.com';
  appRoot.querySelector('#password').value = 'valid1!a';
  const event = new Event('submit', { bubbles: true, cancelable: true });
  appRoot.querySelector('form').dispatchEvent(event);
  jest.runAllTimers();

  expect(appRoot.querySelector('h1').textContent).toContain('Dashboard');
  jest.useRealTimers();
});

test('app can navigate back to login from registration', async () => {
  await setupApp();
  await import('../../src/app.js');
  const appRoot = document.getElementById('app');
  appRoot.querySelector('#register-button').click();
  appRoot.querySelector('#login-button').click();
  expect(appRoot.querySelector('#login-email')).toBeTruthy();
});

test('app blocks account settings when unauthenticated', async () => {
  await setupApp();
  const module = await import('../../src/app.js');
  const appRoot = document.getElementById('app');
  module.__testShowAccountSettings();
  expect(appRoot.querySelector('#login-email')).toBeTruthy();
  expect(appRoot.querySelector('.status').textContent).toContain('log in');
});

test('app keeps user on login when unauthenticated', async () => {
  await setupApp();
  const module = await import('../../src/app.js');
  expect(module).toBeTruthy();
  module.__testShowDashboard();
  const appRoot = document.getElementById('app');
  expect(appRoot.querySelector('#login-email')).toBeTruthy();
});

test('app routes to change password from dashboard', async () => {
  await setupApp();
  const { storageService } = await import('../../src/services/storage-service.js');
  storageService.saveAccount({
    id: 'acct_10',
    email: 'user10@example.com',
    normalizedEmail: 'user10@example.com',
    password: 'validPass1!',
    createdAt: new Date().toISOString(),
  });
  const { sessionState } = await import('../../src/models/session-state.js');
  sessionState.authenticate({ id: 'acct_10', email: 'user10@example.com', createdAt: new Date().toISOString() });
  const module = await import('../../src/app.js');
  const appRoot = document.getElementById('app');
  module.__testShowDashboard();
  appRoot.querySelector('#change-password-button').click();
  expect(appRoot.querySelector('#current-password')).toBeTruthy();
});
