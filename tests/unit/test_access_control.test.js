import { accessControl } from '../../src/services/access_control.js';

test('access control verifies author membership', () => {
  const paper = { authorIds: ['author_1'] };
  expect(accessControl.isAuthor({ paper, authorId: 'author_1' })).toBe(true);
  expect(accessControl.isAuthor({ paper, authorId: 'author_2' })).toBe(false);
  expect(accessControl.isAuthor({ paper: null, authorId: 'author_1' })).toBe(false);
});

test('access control recognizes admin/editor roles', () => {
  expect(accessControl.isAdmin(null)).toBe(false);
  expect(accessControl.isAdmin({ role: 'Admin' })).toBe(true);
  expect(accessControl.isAdmin({ role: 'Editor' })).toBe(true);
  expect(accessControl.isAdmin({ roles: ['admin'] })).toBe(true);
  expect(accessControl.isAdmin({ roles: ['editor'] })).toBe(true);
  expect(accessControl.isAdmin({ email: 'admin@example.com' })).toBe(true);
  expect(accessControl.isAdmin({ role: 'author' })).toBe(false);
});
