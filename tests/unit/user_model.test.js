import { createUser } from '../../src/models/user.js';

test('creates user with defaults', () => {
  const user = createUser();
  expect(user.userId).toMatch(/^user_/);
  expect(user.role).toBe('editor');
});

test('creates user with provided values', () => {
  const user = createUser({ userId: 'user_1', role: 'admin' });
  expect(user.userId).toBe('user_1');
  expect(user.role).toBe('admin');
});
