import { parseTimestamp, isWithinWindow } from '../../src/services/time_window.js';

test('parseTimestamp handles null and invalid', () => {
  expect(parseTimestamp()).toBe(null);
  expect(parseTimestamp('bad')).toBe(null);
});

test('parseTimestamp parses date strings and numbers', () => {
  const now = Date.now();
  expect(parseTimestamp(now)).toBe(now);
  expect(parseTimestamp(new Date(now).toISOString())).toBe(now);
});

test('isWithinWindow checks window and invalid values', () => {
  const now = Date.now();
  expect(isWithinWindow({ timestamp: new Date(now).toISOString(), now })).toBe(true);
  expect(isWithinWindow({ timestamp: new Date(now - 10 * 60 * 1000).toISOString(), now })).toBe(false);
  expect(isWithinWindow({ timestamp: 'bad', now })).toBe(false);
  expect(isWithinWindow({ timestamp: new Date(now).toISOString(), now: 'bad' })).toBe(false);
});

test('isWithinWindow returns false for missing args', () => {
  expect(isWithinWindow()).toBe(false);
});
