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

test('app keeps user on login when unauthenticated', async () => {
  await setupApp();
  const module = await import('../../src/app.js');
  expect(module).toBeTruthy();
  module.__testShowDashboard();
  const appRoot = document.getElementById('app');
  expect(appRoot.querySelector('#login-email')).toBeTruthy();
});
