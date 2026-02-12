import { createUserAccount, findAccountByCredentials, updateAccountPassword } from '../../src/models/user-account.js';
import { storageService } from '../../src/services/storage-service.js';

test('creates account with normalized email', () => {
  const account = createUserAccount({ email: 'Test@Email.com', password: 'valid1!a' });
  expect(account.email).toBe('test@email.com');
  expect(account.id.startsWith('acct_')).toBe(true);
  expect(account.createdAt).toBeTruthy();
});

test('throws on invalid email', () => {
  expect(() => createUserAccount({ email: 'invalid', password: 'valid1!' }))
    .toThrow('email_invalid');
});

test('throws on invalid password', () => {
  expect(() => createUserAccount({ email: 'valid@domain.com', password: 'short' }))
    .toThrow('password_invalid');
});

test('finds account by matching credentials', () => {
  storageService.reset();
  storageService.saveAccount({
    id: 'acct_1',
    email: 'user@example.com',
    normalizedEmail: 'user@example.com',
    password: 'validPass1!',
    createdAt: new Date().toISOString(),
  });
  const account = findAccountByCredentials({
    email: 'USER@example.com',
    password: 'validPass1!',
  }, storageService);
  expect(account).toBeTruthy();
  expect(account.email).toBe('user@example.com');
});

test('returns null when account missing', () => {
  storageService.reset();
  const account = findAccountByCredentials({
    email: 'missing@example.com',
    password: 'validPass1!',
  }, storageService);
  expect(account).toBe(null);
});

test('returns null when password mismatches', () => {
  storageService.reset();
  storageService.saveAccount({
    id: 'acct_2',
    email: 'user2@example.com',
    normalizedEmail: 'user2@example.com',
    password: 'validPass1!',
    createdAt: new Date().toISOString(),
  });
  const account = findAccountByCredentials({
    email: 'user2@example.com',
    password: 'wrongPass',
  }, storageService);
  expect(account).toBe(null);
});

test('propagates lookup errors', () => {
  const storage = {
    normalizeEmail: (value) => value,
    findByEmail: () => {
      throw new Error('lookup_failed');
    },
  };
  expect(() => findAccountByCredentials({ email: 'x', password: 'y' }, storage))
    .toThrow('lookup_failed');
});

test('updates account password by id', () => {
  storageService.reset();
  storageService.saveAccount({
    id: 'acct_change',
    email: 'change@example.com',
    normalizedEmail: 'change@example.com',
    password: 'validPass1!',
    createdAt: new Date().toISOString(),
  });
  const updated = updateAccountPassword({
    accountId: 'acct_change',
    newPassword: 'newPass1!',
  }, storageService);
  expect(updated.password).toBe('newPass1!');
  expect(storageService.findById('acct_change').password).toBe('newPass1!');
});

test('returns null when updating missing account', () => {
  storageService.reset();
  const updated = updateAccountPassword({
    accountId: 'missing',
    newPassword: 'newPass1!',
  }, storageService);
  expect(updated).toBe(null);
});
