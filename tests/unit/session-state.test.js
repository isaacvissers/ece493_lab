import { sessionState } from '../../src/models/session-state.js';
import { storageService } from '../../src/services/storage-service.js';

test('authenticates and reports session', () => {
  storageService.reset();
  const account = {
    id: 'acct_1',
    email: 'user@example.com',
    password: 'validPass1!',
    createdAt: new Date().toISOString(),
  };
  sessionState.authenticate(account);
  expect(sessionState.isAuthenticated()).toBe(true);
  expect(sessionState.getCurrentUser()).toMatchObject({
    id: 'acct_1',
    email: 'user@example.com',
  });
});

test('clears session', () => {
  storageService.reset();
  sessionState.clear();
  expect(sessionState.isAuthenticated()).toBe(false);
});
