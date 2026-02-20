import { createNotificationSettingsView } from '../../src/views/notification_settings_view.js';
import { createNotificationInboxView } from '../../src/views/notification_inbox_view.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

test('notification settings view toggles preferences', () => {
  const view = createNotificationSettingsView();
  document.body.append(view.element);
  view.setStatus('Saved', false);
  expect(view.element.querySelector('#notification-settings-status').textContent).toBe('Saved');
  view.setPreferences({ email: true, inApp: false });
  const prefs = view.getPreferences();
  expect(prefs.email).toBe(true);
  expect(prefs.inApp).toBe(false);
});

test('notification inbox view renders empty state', () => {
  const view = createNotificationInboxView();
  document.body.append(view.element);
  view.setNotifications([]);
  expect(view.element.textContent).toContain('No notifications yet');
});

test('notification inbox view renders entries', () => {
  const view = createNotificationInboxView();
  document.body.append(view.element);
  view.setNotifications([{ channel: 'email', paperId: 'paper_1' }]);
  expect(view.element.textContent).toContain('email');
});
