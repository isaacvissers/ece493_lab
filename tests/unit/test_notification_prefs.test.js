import { notificationPrefs } from '../../src/services/notification_prefs.js';

beforeEach(() => {
  notificationPrefs.reset();
});

test('notification prefs return defaults when missing', () => {
  const prefs = notificationPrefs.getPreferences('author_1');
  expect(prefs.email).toBe(true);
  expect(prefs.inApp).toBe(true);
});

test('notification prefs store settings', () => {
  notificationPrefs.setPreferences('author_2', { email: true, inApp: false });
  const prefs = notificationPrefs.getPreferences('author_2');
  expect(prefs.email).toBe(true);
  expect(prefs.inApp).toBe(false);
});

test('notification prefs reset clears settings', () => {
  notificationPrefs.setPreferences('author_3', { email: false, inApp: false });
  notificationPrefs.reset();
  const prefs = notificationPrefs.getPreferences('author_3');
  expect(prefs.email).toBe(true);
  expect(prefs.inApp).toBe(true);
});
