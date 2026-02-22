import { confirmationNotificationService } from '../../src/services/confirmation_notification_service.js';
import { confirmationStorageService } from '../../src/services/confirmation_storage_service.js';

beforeEach(() => {
  confirmationNotificationService.reset();
  confirmationStorageService.reset();
});

test('confirmation notifications log delivery results', () => {
  const receipt = { id: 'tkt_1', registrationId: 'reg_1' };
  const result = confirmationNotificationService.sendConfirmation({
    registrationId: 'reg_1',
    receipt,
  });
  expect(result.ok).toBe(true);
  const logs = confirmationStorageService.getDeliveryLogs('reg_1');
  expect(logs).toHaveLength(2);
});

test('confirmation notifications report failures', () => {
  confirmationNotificationService.setFailureMode({ email: true });
  const result = confirmationNotificationService.sendConfirmation({
    registrationId: 'reg_2',
    receipt: { id: 'tkt_2', registrationId: 'reg_2' },
  });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('notification_failed');
});

test('confirmation notifications handle in-app failures', () => {
  confirmationNotificationService.setFailureMode({ inApp: true });
  const result = confirmationNotificationService.sendConfirmation({
    registrationId: 'reg_4',
    receipt: { id: 'tkt_4', registrationId: 'reg_4' },
    channels: ['in_app'],
  });
  expect(result.ok).toBe(false);
});

test('confirmation notifications default to no failures', () => {
  confirmationNotificationService.setFailureMode();
  const result = confirmationNotificationService.sendConfirmation({
    registrationId: 'reg_default',
    receipt: { id: 'tkt_default', registrationId: 'reg_default' },
  });
  expect(result.ok).toBe(true);
});

test('confirmation notifications reject missing receipt', () => {
  const result = confirmationNotificationService.sendConfirmation({ registrationId: 'reg_3' });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('missing_receipt');
});

test('confirmation notifications reject missing arguments', () => {
  const result = confirmationNotificationService.sendConfirmation();
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('missing_receipt');
});
