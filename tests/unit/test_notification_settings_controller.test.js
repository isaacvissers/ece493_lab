import { createNotificationSettingsController } from '../../src/controllers/notification_settings_controller.js';
import { createNotificationSettingsView } from '../../src/views/notification_settings_view.js';
import { notificationPrefs } from '../../src/services/notification_prefs.js';

beforeEach(() => {
  document.body.innerHTML = '';
  notificationPrefs.reset();
});

test('notification settings controller saves preferences', () => {
  const view = createNotificationSettingsView();
  document.body.append(view.element);
  const controller = createNotificationSettingsController({ view, authorId: 'author_1', notificationPrefs });
  controller.init();
  view.setPreferences({ email: false, inApp: true });
  view.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  const prefs = notificationPrefs.getPreferences('author_1');
  expect(prefs.inApp).toBe(true);
});

test('notification settings controller handles missing view', () => {
  const controller = createNotificationSettingsController({ view: null, authorId: 'author_2', notificationPrefs });
  expect(() => controller.init()).not.toThrow();
});
