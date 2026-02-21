import { registrationStorage } from './storage.js';
import { createRegistrationWindow } from '../models/registration_window.js';

const WINDOW_KEY = 'cms.registration_window';

function loadWindow() {
  return registrationStorage.read(WINDOW_KEY, null);
}

function persistWindow(window) {
  registrationStorage.write(WINDOW_KEY, window);
}

function parseTimestamp(value) {
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? null : timestamp;
}

export const registrationWindowService = {
  setWindow({ startAt = null, endAt = null } = {}) {
    const next = createRegistrationWindow({
      startAt,
      endAt,
      isOpen: false,
    });
    persistWindow(next);
    return next;
  },
  getWindow(now = Date.now()) {
    const window = loadWindow();
    if (!window) {
      return createRegistrationWindow({ startAt: null, endAt: null, isOpen: false });
    }
    const start = parseTimestamp(window.startAt);
    const end = parseTimestamp(window.endAt);
    const open = start !== null && end !== null && now >= start && now <= end;
    return createRegistrationWindow({
      startAt: window.startAt,
      endAt: window.endAt,
      isOpen: open,
    });
  },
  isOpen(now = Date.now()) {
    const window = registrationWindowService.getWindow(now);
    return Boolean(window.isOpen);
  },
  reset() {
    registrationStorage.remove(WINDOW_KEY);
  },
};
