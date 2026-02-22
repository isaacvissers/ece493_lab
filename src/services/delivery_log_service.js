import { confirmationStorageService as defaultConfirmationStorageService } from './confirmation_storage_service.js';

export const deliveryLogService = {
  logNotification({
    registrationId,
    channel = 'email',
    status = 'sent',
    reason = null,
    confirmationStorageService = defaultConfirmationStorageService,
  } = {}) {
    return confirmationStorageService.saveDeliveryLog({
      registrationId,
      channel,
      status,
      reason,
    });
  },
  logRetry({
    registrationId,
    reason = 'retry',
    confirmationStorageService = defaultConfirmationStorageService,
  } = {}) {
    return confirmationStorageService.saveDeliveryLog({
      registrationId,
      channel: 'system',
      status: 'retrying',
      reason,
    });
  },
  getLatestStatus({
    registrationId,
    confirmationStorageService = defaultConfirmationStorageService,
  } = {}) {
    if (!registrationId) {
      return { emailStatus: null, inAppStatus: null };
    }
    const logs = confirmationStorageService.getDeliveryLogs(registrationId);
    const latest = { emailStatus: null, inAppStatus: null };
    logs.forEach((entry) => {
      if (entry.channel === 'email') {
        latest.emailStatus = entry.status;
      }
      if (entry.channel === 'in_app') {
        latest.inAppStatus = entry.status;
      }
    });
    return latest;
  },
};
