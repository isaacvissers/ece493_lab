import { notificationPrefs as defaultNotificationPrefs } from '../services/notification_prefs.js';

export function createNotificationSettingsController({
  view,
  authorId,
  notificationPrefs = defaultNotificationPrefs,
} = {}) {
  function handleSubmit(event) {
    event.preventDefault();
    const prefs = view.getPreferences();
    notificationPrefs.setPreferences(authorId, prefs);
    view.setStatus('Preferences saved.', false);
  }

  return {
    init() {
      if (!view) {
        return;
      }
      const prefs = notificationPrefs.getPreferences(authorId);
      view.setPreferences(prefs);
      view.onSubmit(handleSubmit);
    },
  };
}
