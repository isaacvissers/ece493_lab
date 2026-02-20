import { storageService } from '../../src/services/storage-service.js';

test('normalizes email for lookup', () => {
  expect(storageService.normalizeEmail('  User@Example.com ')).toBe('user@example.com');
  expect(storageService.normalizeEmail(null)).toBe('');
});

test('ensureAccount creates and updates admin accounts', () => {
  storageService.reset();
  const created = storageService.ensureAccount({
    id: 'acct_admin',
    email: 'admin@example.com',
    password: 'admin',
    role: 'Editor',
    roles: ['admin', 'editor'],
    createdAt: new Date().toISOString(),
  });
  expect(created).toBeTruthy();
  expect(storageService.findByEmail('admin@example.com')).toBeTruthy();

  const updated = storageService.ensureAccount({
    id: 'acct_admin',
    email: 'admin@example.com',
    password: 'new',
    role: 'Editor',
    roles: ['admin', 'editor'],
  });
  expect(updated.password).toBe('new');
  expect(storageService.findByEmail('admin@example.com').password).toBe('new');
});

test('ensureAccount ignores missing email', () => {
  storageService.reset();
  const result = storageService.ensureAccount({ email: '' });
  expect(result).toBe(null);
  expect(storageService.getAccounts()).toEqual([]);
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

test('finds and updates accounts by id', () => {
  storageService.reset();
  storageService.saveAccount({
    id: 'acct_update',
    email: 'update@example.com',
    normalizedEmail: 'update@example.com',
    password: 'validPass1!',
    createdAt: new Date().toISOString(),
  });
  const found = storageService.findById('acct_update');
  expect(found.email).toBe('update@example.com');
  const updated = storageService.updateAccount({ ...found, password: 'newPass1!' });
  expect(updated.password).toBe('newPass1!');
  expect(storageService.findById('acct_update').password).toBe('newPass1!');
});

test('updateAccount returns null when missing', () => {
  storageService.reset();
  const result = storageService.updateAccount({ id: 'missing', email: 'x' });
  expect(result).toBe(null);
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
  storageService.setCurrentUser(null);
  expect(storageService.getCurrentUser()).toBe(null);
  storageService.clearCurrentUser();
  expect(storageService.getCurrentUser()).toBe(null);
});

test('stores roles when present and defaults to empty array', () => {
  storageService.reset();
  storageService.setCurrentUser({
    id: 'acct_roles',
    email: 'roles@example.com',
    createdAt: new Date().toISOString(),
    roles: ['admin', 'editor'],
  });
  expect(storageService.getCurrentUser().roles).toEqual(['admin', 'editor']);

  storageService.setCurrentUser({
    id: 'acct_no_roles',
    email: 'noroles@example.com',
    createdAt: new Date().toISOString(),
    roles: null,
  });
  expect(storageService.getCurrentUser().roles).toEqual([]);
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
  localStorage.setItem('cms.validation_failures', JSON.stringify([{ type: 'format', field: 'email' }]));
  const accounts = storageService.getAccounts();
  expect(accounts.length).toBe(1);
  const session = storageService.getCurrentUser();
  expect(session.email).toBe('session@example.com');
  storageService.logValidationFailure({ type: 'required', field: 'email' });
  const log = JSON.parse(localStorage.getItem('cms.validation_failures') || '[]');
  expect(log.length).toBe(2);
});

test('throws when storage failure mode enabled', () => {
  storageService.reset();
  storageService.setFailureMode(true);
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

test('logs validation failures', () => {
  storageService.reset();
  storageService.logValidationFailure({ type: 'format', field: 'email' });
  const raw = localStorage.getItem('cms.validation_failures');
  const log = JSON.parse(raw || '[]');
  expect(log.length).toBe(1);
  expect(log[0].type).toBe('format');
});
