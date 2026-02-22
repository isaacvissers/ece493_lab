import { deliveryLogService as defaultDeliveryLogService } from './delivery_log_service.js';

let failureMode = {
  email: false,
  inApp: false,
};

export const confirmationNotificationService = {
  setFailureMode({ email = false, inApp = false } = {}) {
    failureMode = {
      email: Boolean(email),
      inApp: Boolean(inApp),
    };
  },
  reset() {
    failureMode = { email: false, inApp: false };
  },
  sendConfirmation({
    registrationId,
    receipt,
    channels = ['email', 'in_app'],
    deliveryLogService = defaultDeliveryLogService,
  } = {}) {
    if (!registrationId || !receipt) {
      return { ok: false, reason: 'missing_receipt' };
    }
    const results = [];
    let failed = false;
    channels.forEach((channel) => {
      const normalized = channel === 'in_app' ? 'in_app' : 'email';
      const shouldFail = normalized === 'email' ? failureMode.email : failureMode.inApp;
      deliveryLogService.logNotification({
        registrationId,
        channel: normalized,
        status: shouldFail ? 'failed' : 'sent',
        reason: shouldFail ? `${normalized}_failure` : 'confirmation_delivery',
      });
      results.push({ channel: normalized, status: shouldFail ? 'failed' : 'sent' });
      if (shouldFail) {
        failed = true;
      }
    });
    return { ok: !failed, results, reason: failed ? 'notification_failed' : null };
  },
};
