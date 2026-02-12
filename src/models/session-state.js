import { storageService } from '../services/storage-service.js';

export const sessionState = {
  authenticate(account) {
    storageService.setCurrentUser(account);
  },
  clear() {
    storageService.clearCurrentUser();
  },
  isAuthenticated() {
    return Boolean(storageService.getCurrentUser());
  },
  getCurrentUser() {
    return storageService.getCurrentUser();
  },
  ensureLoggedOut() {
    const current = storageService.getCurrentUser();
    if (current) {
      storageService.clearCurrentUser();
      return true;
    }
    return false;
  },
};
