import { decisionStorage } from '../../src/services/storage.js';

beforeEach(() => {
  decisionStorage.clearAll();
  localStorage.clear();
});

test('decision storage reads and writes values', () => {
  decisionStorage.write('key', { value: 1 });
  const result = decisionStorage.read('key', {});
  expect(result.value).toBe(1);
});

test('decision storage uses cache for subsequent reads', () => {
  decisionStorage.write('key', { value: 2 });
  const first = decisionStorage.read('key', {});
  localStorage.setItem('key', JSON.stringify({ value: 3 }));
  const second = decisionStorage.read('key', {});
  expect(first.value).toBe(2);
  expect(second.value).toBe(2);
});

test('decision storage remove clears cache', () => {
  decisionStorage.write('key', { value: 4 });
  decisionStorage.remove('key');
  const result = decisionStorage.read('key', { value: 0 });
  expect(result.value).toBe(0);
});
