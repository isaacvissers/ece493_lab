import { createPriceItem, isAllowedCategory } from '../../src/models/price_item.js';

test('accepts allowed pricing categories', () => {
  const item = createPriceItem({ category: 'student', amount: 50, status: 'valid' });
  expect(item.category).toBe('student');
  expect(item.status).toBe('valid');
  expect(isAllowedCategory('student')).toBe(true);
});

test('marks invalid categories as invalid', () => {
  const item = createPriceItem({ category: 'vip', amount: 200, status: 'valid' });
  expect(item.category).toBeNull();
  expect(item.status).toBe('invalid');
  expect(isAllowedCategory('vip')).toBe(false);
});
