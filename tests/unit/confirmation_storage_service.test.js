import { confirmationStorageService } from '../../src/services/confirmation_storage_service.js';
import { confirmationStorage } from '../../src/services/storage.js';

beforeEach(() => {
  confirmationStorageService.reset();
});

test('confirmation storage saves and retrieves records and receipts', () => {
  const receipt = confirmationStorageService.saveReceipt({
    registrationId: 'reg_store',
    attendeeName: 'Ada',
    ticketType: 'Virtual',
  });
  confirmationStorageService.saveRecord({
    registrationId: 'reg_store',
    receiptId: receipt.id,
    status: 'generated',
  });
  const storedReceipt = confirmationStorageService.getReceiptByRegistration('reg_store');
  const storedRecord = confirmationStorageService.getRecordByRegistration('reg_store');
  expect(storedReceipt.attendeeName).toBe('Ada');
  expect(storedRecord.status).toBe('generated');
  expect(confirmationStorageService.getRecords()).toHaveLength(1);
});

test('confirmation storage saves delivery logs', () => {
  confirmationStorageService.saveDeliveryLog({
    registrationId: 'reg_log',
    channel: 'email',
    status: 'sent',
  });
  const logs = confirmationStorageService.getDeliveryLogs('reg_log');
  expect(logs).toHaveLength(1);
  const allLogs = confirmationStorageService.getDeliveryLogs();
  expect(allLogs.length).toBeGreaterThan(0);
});

test('confirmation storage throws when failure mode enabled', () => {
  confirmationStorageService.setFailureMode(true);
  expect(() => {
    confirmationStorageService.saveReceipt({ registrationId: 'reg_fail' });
  }).toThrow();
});

test('confirmation storage skips empty entries when searching receipts', () => {
  confirmationStorage.write('cms.confirmation_receipts', [null]);
  const receipt = confirmationStorageService.getReceiptByRegistration('missing');
  expect(receipt).toBe(null);
});
