import { storageService } from '../../src/services/storage-service.js';

test('normalizes email for lookup', () => {
  expect(storageService.normalizeEmail('  User@Example.com ')).toBe('user@example.com');
});

test('saves and finds accounts case-insensitively', () => {
  storageService.reset();
  storageService.saveAccount({
    id: 'acct_1',
    email: 'user@example.com',
    normalizedEmail: 'user@example.com',
    password: 'validPass1!',
    createdAt: new Date().toISOString(),
  });
  const found = storageService.findByEmail('USER@example.com');
  expect(found).toBeTruthy();
  expect(storageService.getAccounts().length).toBe(1);
  expect(storageService.getAccounts().length).toBe(1);
});

test('persists and clears session', () => {
  storageService.reset();
  storageService.setCurrentUser({
    id: 'acct_2',
    email: 'user2@example.com',
    createdAt: new Date().toISOString(),
  });
  expect(storageService.getCurrentUser()).toMatchObject({
    id: 'acct_2',
  });
  storageService.clearCurrentUser();
  expect(storageService.getCurrentUser()).toBe(null);
});

test('loads cached data from storage when present', () => {
  storageService.reset();
  const cachedAccounts = [{
    id: 'acct_cache',
    email: 'cache@example.com',
    normalizedEmail: 'cache@example.com',
    password: 'validPass1!',
    createdAt: new Date().toISOString(),
  }];
  const cachedSession = {
    id: 'acct_session',
    email: 'session@example.com',
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem('cms.accounts', JSON.stringify(cachedAccounts));
  localStorage.setItem('cms.session', JSON.stringify(cachedSession));
  const accounts = storageService.getAccounts();
  expect(accounts.length).toBe(1);
  const session = storageService.getCurrentUser();
  expect(session.email).toBe('session@example.com');
});

test('throws when storage failure mode enabled', () => {
  storageService.reset();
  storageService.setFailureMode(true);
  expect(() => storageService.getAccounts()).toThrow('storage_failure');
  expect(() => storageService.getCurrentUser()).toThrow('storage_failure');
  expect(() => storageService.saveAccount({
    id: 'acct_3',
    email: 'fail@example.com',
    normalizedEmail: 'fail@example.com',
    password: 'validPass1!',
    createdAt: new Date().toISOString(),
  })).toThrow('storage_failure');
  expect(() => storageService.setCurrentUser({
    id: 'acct_4',
    email: 'fail@example.com',
    createdAt: new Date().toISOString(),
  })).toThrow('storage_failure');
  storageService.setFailureMode(false);
});
