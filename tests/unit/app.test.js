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

test('app routes to submit manuscript from dashboard', async () => {
  await setupApp();
  const { sessionState } = await import('../../src/models/session-state.js');
  sessionState.authenticate({ id: 'acct_11', email: 'author@example.com', createdAt: new Date().toISOString() });
  const module = await import('../../src/app.js');
  const appRoot = document.getElementById('app');
  module.__testShowDashboard();
  appRoot.querySelector('#submit-paper-button').click();
  expect(appRoot.querySelector('#title')).toBeTruthy();
});

test('dashboard filters submissions by current user email', async () => {
  await setupApp();
  const { submissionStorage } = await import('../../src/services/submission-storage.js');
  submissionStorage.reset();
  submissionStorage.saveSubmission({
    id: 'ms_1',
    title: 'By author',
    contactEmail: 'other@example.com',
    submittedBy: 'author@example.com',
    status: 'submitted',
  });
  submissionStorage.saveSubmission({
    id: 'ms_2',
    title: 'By contact',
    contactEmail: 'author@example.com',
    submittedBy: 'someone@example.com',
    status: 'approved',
  });
  submissionStorage.saveSubmission({
    id: 'ms_3',
    title: 'Other',
    contactEmail: 'other@example.com',
    submittedBy: 'other@example.com',
    status: 'submitted',
  });
  const { sessionState } = await import('../../src/models/session-state.js');
  sessionState.authenticate({ id: 'acct_19', email: 'author@example.com', createdAt: new Date().toISOString() });
  const module = await import('../../src/app.js');
  const appRoot = document.getElementById('app');
  module.__testShowDashboard();
  const items = appRoot.querySelectorAll('.submission-item');
  expect(items).toHaveLength(2);
  expect(items[0].textContent).toContain('By author');
  expect(items[1].textContent).toContain('By contact');
});

test('dashboard shows no submissions when user email missing', async () => {
  await setupApp();
  const { submissionStorage } = await import('../../src/services/submission-storage.js');
  submissionStorage.reset();
  submissionStorage.saveSubmission({
    id: 'ms_4',
    title: 'Stored submission',
    contactEmail: 'ghost@example.com',
    submittedBy: 'ghost@example.com',
    status: 'submitted',
  });
  const { sessionState } = await import('../../src/models/session-state.js');
  sessionState.authenticate({ id: 'acct_20', createdAt: new Date().toISOString() });
  const module = await import('../../src/app.js');
  const appRoot = document.getElementById('app');
  module.__testShowDashboard();
  expect(appRoot.querySelector('.submission-list').textContent).toContain('No submissions yet.');
});

test('unauthenticated submit routes to login then back to submission', async () => {
  await setupApp();
  const { storageService } = await import('../../src/services/storage-service.js');
  storageService.saveAccount({
    id: 'acct_12',
    email: 'author2@example.com',
    normalizedEmail: 'author2@example.com',
    password: 'validPass1!',
    createdAt: new Date().toISOString(),
  });
  const module = await import('../../src/app.js');
  const appRoot = document.getElementById('app');
  module.__testShowSubmitManuscript();
  expect(appRoot.querySelector('#login-email')).toBeTruthy();
  appRoot.querySelector('#login-email').value = 'author2@example.com';
  appRoot.querySelector('#login-password').value = 'validPass1!';
  const event = new Event('submit', { bubbles: true, cancelable: true });
  appRoot.querySelector('form').dispatchEvent(event);
  expect(appRoot.querySelector('#title')).toBeTruthy();
});

test('unauthenticated upload routes to login then back to upload view', async () => {
  await setupApp();
  const { storageService } = await import('../../src/services/storage-service.js');
  storageService.saveAccount({
    id: 'acct_14',
    email: 'upload2@example.com',
    normalizedEmail: 'upload2@example.com',
    password: 'validPass1!',
    createdAt: new Date().toISOString(),
  });
  const module = await import('../../src/app.js');
  const appRoot = document.getElementById('app');
  module.__testShowUploadManuscript();
  expect(appRoot.querySelector('#login-email')).toBeTruthy();
  appRoot.querySelector('#login-email').value = 'upload2@example.com';
  appRoot.querySelector('#login-password').value = 'validPass1!';
  const event = new Event('submit', { bubbles: true, cancelable: true });
  appRoot.querySelector('form').dispatchEvent(event);
  expect(appRoot.querySelector('#title')).toBeTruthy();
});

test('unauthenticated metadata routes to login then back to metadata view', async () => {
  await setupApp();
  const { storageService } = await import('../../src/services/storage-service.js');
  storageService.saveAccount({
    id: 'acct_16',
    email: 'meta2@example.com',
    normalizedEmail: 'meta2@example.com',
    password: 'validPass1!',
    createdAt: new Date().toISOString(),
  });
  const module = await import('../../src/app.js');
  const appRoot = document.getElementById('app');
  module.__testShowMetadata();
  expect(appRoot.querySelector('#login-email')).toBeTruthy();
  appRoot.querySelector('#login-email').value = 'meta2@example.com';
  appRoot.querySelector('#login-password').value = 'validPass1!';
  const event = new Event('submit', { bubbles: true, cancelable: true });
  appRoot.querySelector('form').dispatchEvent(event);
  expect(appRoot.querySelector('#title')).toBeTruthy();
});

test('unauthenticated validation routes to login then back to validation view', async () => {
  await setupApp();
  const { storageService } = await import('../../src/services/storage-service.js');
  storageService.saveAccount({
    id: 'acct_18',
    email: 'validate2@example.com',
    normalizedEmail: 'validate2@example.com',
    password: 'validPass1!',
    createdAt: new Date().toISOString(),
  });
  const module = await import('../../src/app.js');
  const appRoot = document.getElementById('app');
  module.__testShowSubmissionValidation();
  expect(appRoot.querySelector('#login-email')).toBeTruthy();
  appRoot.querySelector('#login-email').value = 'validate2@example.com';
  appRoot.querySelector('#login-password').value = 'validPass1!';
  const event = new Event('submit', { bubbles: true, cancelable: true });
  appRoot.querySelector('form').dispatchEvent(event);
  expect(appRoot.querySelector('#title')).toBeTruthy();
});
