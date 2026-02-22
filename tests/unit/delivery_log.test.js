import { confirmationStorageService } from '../../src/services/confirmation_storage_service.js';
import { deliveryLogService } from '../../src/services/delivery_log_service.js';

beforeEach(() => {
  confirmationStorageService.reset();
});

test('delivery log service records notification attempts', () => {
  deliveryLogService.logNotification({ registrationId: 'reg_log', channel: 'email', status: 'sent' });
  deliveryLogService.logNotification({ registrationId: 'reg_log', channel: 'in_app', status: 'failed' });
  const logs = confirmationStorageService.getDeliveryLogs('reg_log');
  expect(logs).toHaveLength(2);
  const status = deliveryLogService.getLatestStatus({ registrationId: 'reg_log' });
  expect(status.emailStatus).toBe('sent');
  expect(status.inAppStatus).toBe('failed');
});

test('delivery log service logs retries for pending confirmations', () => {
  deliveryLogService.logRetry({ registrationId: 'reg_retry' });
  const logs = confirmationStorageService.getDeliveryLogs('reg_retry');
  expect(logs[0].channel).toBe('system');
  expect(logs[0].status).toBe('retrying');
});

test('delivery log service handles missing logs', () => {
  const status = deliveryLogService.getLatestStatus({ registrationId: 'missing' });
  expect(status.emailStatus).toBe(null);
  expect(status.inAppStatus).toBe(null);
});

test('delivery log service supports default arguments', () => {
  const entry = deliveryLogService.logNotification();
  expect(entry.channel).toBe('email');
  const retry = deliveryLogService.logRetry();
  expect(retry.status).toBe('retrying');
  const status = deliveryLogService.getLatestStatus();
  expect(status).toEqual({ emailStatus: null, inAppStatus: null });
});
