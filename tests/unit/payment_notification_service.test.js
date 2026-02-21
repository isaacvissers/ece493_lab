import { paymentNotificationService } from '../../src/services/payment_notification_service.js';

beforeEach(() => {
  paymentNotificationService.reset();
});

test('payment notification can fail when failure mode enabled', () => {
  paymentNotificationService.setFailureMode(true);
  const result = paymentNotificationService.sendPaymentConfirmation({
    registrationId: 'reg_notify',
    receipt: { reference: 'ref_1' },
  });
  expect(result.ok).toBe(false);
});

test('payment notification records email and in-app entries', () => {
  const result = paymentNotificationService.sendPaymentConfirmation({
    registrationId: 'reg_notify',
    receipt: { reference: 'ref_2' },
  });
  expect(result.ok).toBe(true);
  const notifications = paymentNotificationService.getNotifications();
  expect(notifications).toHaveLength(2);
});

test('payment notification handles missing receipt reference', () => {
  const result = paymentNotificationService.sendPaymentConfirmation();
  expect(result.ok).toBe(true);
  const notifications = paymentNotificationService.getNotifications();
  expect(notifications[0].receiptRef).toBe(null);
});
