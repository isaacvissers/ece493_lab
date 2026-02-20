import { accessControl } from '../../src/services/access_control.js';

test('access control verifies author membership', () => {
  const paper = { authorIds: ['author_1'] };
  expect(accessControl.isAuthor({ paper, authorId: 'author_1' })).toBe(true);
  expect(accessControl.isAuthor({ paper, authorId: 'author_2' })).toBe(false);
  expect(accessControl.isAuthor({ paper: null, authorId: 'author_1' })).toBe(false);
});
