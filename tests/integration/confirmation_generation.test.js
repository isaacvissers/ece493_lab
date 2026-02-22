import { registrationService } from '../../src/services/registration_service.js';
import { registrationWindowService } from '../../src/services/registration_window_service.js';
import { paymentService } from '../../src/services/payment_service.js';
import { paymentStorageService } from '../../src/services/payment_storage_service.js';
import { confirmationStorageService } from '../../src/services/confirmation_storage_service.js';
import { confirmationGeneratorService } from '../../src/services/confirmation_generator_service.js';

beforeEach(() => {
  registrationService.reset();
  registrationWindowService.setWindow({
    startAt: new Date(Date.now() - 1000 * 60).toISOString(),
    endAt: new Date(Date.now() + 1000 * 60).toISOString(),
  });
  paymentService.reset();
  paymentStorageService.reset();
  confirmationStorageService.reset();
  confirmationGeneratorService.reset();
});

test('confirmation generation stores receipt and record', () => {
  const registrationResult = registrationService.submitRegistration({
    userId: 'acct_attendee',
    values: {
      name: 'Ada Lovelace',
      affiliation: 'Computing',
      contactEmail: 'ada@example.com',
      attendanceType: 'virtual',
    },
    paymentService,
  });
  const result = confirmationGeneratorService.generateConfirmation({
    registrationId: registrationResult.registration.id,
  });
  expect(result.ok).toBe(true);
  const receipt = confirmationStorageService.getReceiptByRegistration(registrationResult.registration.id);
  expect(receipt).toBeTruthy();
  const record = confirmationStorageService.getRecordByRegistration(registrationResult.registration.id);
  expect(record.status).toBe('generated');
});
