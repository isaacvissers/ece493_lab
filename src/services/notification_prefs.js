import { decisionStorage } from './storage.js';

const PREFS_KEY = 'cms.notification_prefs';

function loadPrefs() {
  return decisionStorage.read(PREFS_KEY, {});
}

function persistPrefs(prefs) {
  decisionStorage.write(PREFS_KEY, prefs);
}

export const notificationPrefs = {
  getPreferences(authorId) {
    const prefs = loadPrefs();
    return prefs[authorId] || { email: true, inApp: true };
  },
  setPreferences(authorId, settings) {
    const prefs = loadPrefs();
    prefs[authorId] = {
      email: Boolean(settings && settings.email),
      inApp: Boolean(settings && settings.inApp),
    };
    persistPrefs(prefs);
  },
  reset() {
    decisionStorage.remove(PREFS_KEY);
  },
};
