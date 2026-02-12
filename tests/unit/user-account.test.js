import { findAccountByCredentials } from '../../src/models/user-account.js';
import { storageService } from '../../src/services/storage-service.js';

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
