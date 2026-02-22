import { confirmationGeneratorService } from '../../src/services/confirmation_generator_service.js';
import { confirmationStorageService } from '../../src/services/confirmation_storage_service.js';

beforeEach(() => {
  confirmationGeneratorService.reset();
  confirmationStorageService.reset();
});

test('confirmation generator maps required receipt details', () => {
  const registration = {
    id: 'reg_conf',
    name: 'Ada Lovelace',
    attendanceType: 'in_person',
  };
  const payment = {
    registrationId: 'reg_conf',
    status: 'captured',
    amount: 150,
    reference: 'pay_150',
  };
  const paymentReceipt = {
    amount: 150,
    reference: 'rcpt_150',
    paidAt: '2026-02-20T12:00:00.000Z',
  };
  const registrationService = {
    getRegistrationById: () => registration,
  };
  const paymentStorageService = {
    getPaymentByRegistration: () => payment,
    getReceiptByRegistration: () => paymentReceipt,
  };

  const result = confirmationGeneratorService.generateConfirmation({
    registrationId: 'reg_conf',
    registrationService,
    paymentStorageService,
    confirmationStorageService,
  });

  expect(result.ok).toBe(true);
  expect(result.receipt.attendeeName).toBe('Ada Lovelace');
  expect(result.receipt.ticketType).toBe('In-person');
  expect(result.receipt.amountPaid).toBe(150);
  expect(result.receipt.transactionReference).toBe('rcpt_150');
  expect(result.receipt.issuedAt).toBe('2026-02-20T12:00:00.000Z');
});

test('confirmation generator requires registration id', () => {
  const result = confirmationGeneratorService.generateConfirmation();
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('missing_registration');
});

test('confirmation generator reports missing registration', () => {
  const result = confirmationGeneratorService.generateConfirmation({
    registrationId: 'reg_missing',
    registrationService: { getRegistrationById: () => null },
    paymentStorageService: { getPaymentByRegistration: () => null, getReceiptByRegistration: () => null },
    confirmationStorageService,
  });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('not_found');
});

test('confirmation generator rejects incomplete payment', () => {
  const registrationService = {
    getRegistrationById: () => ({ id: 'reg_conf', name: 'Ada', attendanceType: 'virtual' }),
  };
  const paymentStorageService = {
    getPaymentByRegistration: () => ({ status: 'failed' }),
    getReceiptByRegistration: () => null,
  };
  const result = confirmationGeneratorService.generateConfirmation({
    registrationId: 'reg_conf',
    registrationService,
    paymentStorageService,
    confirmationStorageService,
  });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('payment_incomplete');
});

test('confirmation generator treats missing payment as incomplete', () => {
  const registrationService = {
    getRegistrationById: () => ({ id: 'reg_missing_pay', name: 'Ada', attendanceType: 'vip' }),
  };
  const paymentStorageService = {
    getPaymentByRegistration: () => null,
    getReceiptByRegistration: () => null,
  };
  const result = confirmationGeneratorService.generateConfirmation({
    registrationId: 'reg_missing_pay',
    registrationService,
    paymentStorageService,
    confirmationStorageService,
  });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('payment_incomplete');
});

test('confirmation generator returns existing record without duplicates', () => {
  const receipt = confirmationStorageService.saveReceipt({
    registrationId: 'reg_dup',
    attendeeName: 'Ada',
    ticketType: 'Virtual',
    amountPaid: 0,
    transactionReference: 'ref_dup',
  });
  confirmationStorageService.saveRecord({
    registrationId: 'reg_dup',
    receiptId: receipt.id,
    status: 'generated',
  });

  const result = confirmationGeneratorService.generateConfirmation({
    registrationId: 'reg_dup',
    registrationService: { getRegistrationById: () => null },
    paymentStorageService: { getPaymentByRegistration: () => null, getReceiptByRegistration: () => null },
    confirmationStorageService,
  });

  expect(result.ok).toBe(true);
  expect(result.generated).toBe(false);
  expect(result.receipt.registrationId).toBe('reg_dup');
});

test('confirmation generator returns pending when generation fails', () => {
  confirmationGeneratorService.setFailureMode(true);
  const registrationService = {
    getRegistrationById: () => ({ id: 'reg_pending', name: 'Ada', attendanceType: 'virtual' }),
  };
  const paymentStorageService = {
    getPaymentByRegistration: () => ({ status: 'success', amount: 0 }),
    getReceiptByRegistration: () => null,
  };
  const result = confirmationGeneratorService.generateConfirmation({
    registrationId: 'reg_pending',
    registrationService,
    paymentStorageService,
    confirmationStorageService,
  });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('pending');
  const record = confirmationStorageService.getRecordByRegistration('reg_pending');
  expect(record.status).toBe('pending');
});

test('confirmation generator falls back to payment reference when receipt missing', () => {
  const registrationService = {
    getRegistrationById: () => ({ id: 'reg_ref', name: 'Ada', attendanceType: 'virtual' }),
  };
  const paymentStorageService = {
    getPaymentByRegistration: () => ({ status: 'success', amount: 80, reference: 'pay_ref' }),
    getReceiptByRegistration: () => null,
  };
  const result = confirmationGeneratorService.generateConfirmation({
    registrationId: 'reg_ref',
    registrationService,
    paymentStorageService,
    confirmationStorageService,
  });
  expect(result.ok).toBe(true);
  expect(result.receipt.transactionReference).toBe('pay_ref');
});

test('confirmation generator reports storage failure when persistence fails', () => {
  const registrationService = {
    getRegistrationById: () => ({ id: 'reg_store', name: 'Ada', attendanceType: 'virtual' }),
  };
  const paymentStorageService = {
    getPaymentByRegistration: () => ({ status: 'success', amount: 80, reference: 'pay_ref' }),
    getReceiptByRegistration: () => null,
  };
  confirmationStorageService.setFailureMode(true);
  const result = confirmationGeneratorService.generateConfirmation({
    registrationId: 'reg_store',
    registrationService,
    paymentStorageService,
    confirmationStorageService,
  });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('storage_failed');
});

test('confirmation generator uses raw ticket type for unknown values', () => {
  const registrationService = {
    getRegistrationById: () => ({ id: 'reg_custom', name: 'Ada', attendanceType: 'vip' }),
  };
  const paymentStorageService = {
    getPaymentByRegistration: () => ({ status: 'not_required', amount: 0, providerRef: 'free' }),
    getReceiptByRegistration: () => null,
  };
  const result = confirmationGeneratorService.generateConfirmation({
    registrationId: 'reg_custom',
    registrationService,
    paymentStorageService,
    confirmationStorageService,
  });
  expect(result.ok).toBe(true);
  expect(result.receipt.ticketType).toBe('vip');
});

test('confirmation generator handles empty attendance type', () => {
  const registrationService = {
    getRegistrationById: () => ({ id: 'reg_empty', name: 'Ada', attendanceType: '' }),
  };
  const paymentStorageService = {
    getPaymentByRegistration: () => ({ status: 'success', amount: 20, providerRef: 'paid' }),
    getReceiptByRegistration: () => null,
  };
  const result = confirmationGeneratorService.generateConfirmation({
    registrationId: 'reg_empty',
    registrationService,
    paymentStorageService,
    confirmationStorageService,
  });
  expect(result.ok).toBe(true);
  expect(result.receipt.ticketType).toBe('');
});

test('confirmation generator reports storage failure when pending save fails', () => {
  confirmationGeneratorService.setFailureMode(true);
  const registrationService = {
    getRegistrationById: () => ({ id: 'reg_fail', name: 'Ada', attendanceType: 'virtual' }),
  };
  const paymentStorageService = {
    getPaymentByRegistration: () => ({ status: 'success', amount: 0, providerRef: 'paid' }),
    getReceiptByRegistration: () => null,
  };
  confirmationStorageService.setFailureMode(true);
  const result = confirmationGeneratorService.generateConfirmation({
    registrationId: 'reg_fail',
    registrationService,
    paymentStorageService,
    confirmationStorageService,
  });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('storage_failed');
});

test('confirmation generator reports storage failure when log retry fails', () => {
  const registrationService = {
    getRegistrationById: () => ({ id: 'reg_log_fail', name: 'Ada', attendanceType: 'virtual' }),
  };
  const paymentStorageService = {
    getPaymentByRegistration: () => ({ status: 'success', amount: 20, providerRef: 'paid' }),
    getReceiptByRegistration: () => null,
  };
  const deliveryLogService = {
    logRetry: () => { throw new Error('log_failure'); },
  };
  confirmationStorageService.setFailureMode(true);
  const result = confirmationGeneratorService.generateConfirmation({
    registrationId: 'reg_log_fail',
    registrationService,
    paymentStorageService,
    confirmationStorageService,
    deliveryLogService,
  });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('storage_failed');
});

test('confirmation generator handles missing registration lookup method', () => {
  const result = confirmationGeneratorService.generateConfirmation({
    registrationId: 'reg_missing_method',
    registrationService: {},
    paymentStorageService: { getPaymentByRegistration: () => null, getReceiptByRegistration: () => null },
    confirmationStorageService,
  });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('not_found');
});

test('confirmation generator handles empty attendee name', () => {
  const registrationService = {
    getRegistrationById: () => ({ id: 'reg_empty_name', name: '', attendanceType: 'virtual' }),
  };
  const paymentStorageService = {
    getPaymentByRegistration: () => ({ status: 'success', amount: 25 }),
    getReceiptByRegistration: () => null,
  };
  const result = confirmationGeneratorService.generateConfirmation({
    registrationId: 'reg_empty_name',
    registrationService,
    paymentStorageService,
    confirmationStorageService,
  });
  expect(result.ok).toBe(true);
  expect(result.receipt.attendeeName).toBe('');
});

test('confirmation generator returns null when payment references are missing', () => {
  const registrationService = {
    getRegistrationById: () => ({ id: 'reg_no_ref', name: 'Ada', attendanceType: 'virtual' }),
  };
  const paymentStorageService = {
    getPaymentByRegistration: () => ({ status: 'success', amount: 10 }),
    getReceiptByRegistration: () => null,
  };
  const result = confirmationGeneratorService.generateConfirmation({
    registrationId: 'reg_no_ref',
    registrationService,
    paymentStorageService,
    confirmationStorageService,
  });
  expect(result.ok).toBe(true);
  expect(result.receipt.transactionReference).toBe(null);
});
