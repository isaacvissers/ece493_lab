import { notificationService } from './notification-service.js';

export const notificationConfigService = {
  setGroupingEnabled(enabled) {
    notificationService.setGroupingEnabled(enabled);
  },
  isGroupingEnabled() {
    return notificationService.shouldBatch(Date.now());
  },
};
