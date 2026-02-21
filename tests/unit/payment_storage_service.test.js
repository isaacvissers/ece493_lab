import { paymentStorageService } from '../../src/services/payment_storage_service.js';
import { paymentStorage } from '../../src/services/storage.js';

beforeEach(() => {
  paymentStorageService.reset();
});

test('payment storage throws when failure mode enabled', () => {
  paymentStorageService.setFailureMode(true);
  expect(() => paymentStorageService.savePayment({ id: 'pay_fail' })).toThrow('storage_failure');
  paymentStorageService.setFailureMode(false);
});

test('payment storage can retrieve receipts and gateway responses', () => {
  paymentStorageService.savePayment({ id: 'pay_1', registrationId: 'reg_1', amount: 10 });
  paymentStorageService.saveReceipt({ paymentId: 'pay_1', registrationId: 'reg_1', amount: 10, reference: 'ref_1' });
  paymentStorageService.saveGatewayResponse({ paymentId: 'pay_1', result: 'approved' });

  const receipt = paymentStorageService.getReceiptByRegistration('reg_1');
  const response = paymentStorageService.getGatewayResponse('pay_1');
  expect(receipt.reference).toBe('ref_1');
  expect(response.result).toBe('approved');
});

test('payment storage finds payments by idempotency key', () => {
  paymentStorageService.savePayment({ id: 'pay_idem', registrationId: 'reg_idem', idempotencyKey: 'idem_1' });
  const found = paymentStorageService.getPaymentByIdempotencyKey('idem_1');
  expect(found.id).toBe('pay_idem');
});

test('payment storage skips null entries when searching', () => {
  paymentStorage.write('cms.payment_gateway_responses', [null, { paymentId: 'pay_null', result: 'approved' }]);
  paymentStorage.write('cms.payment_receipts', [null, { paymentId: 'pay_null', registrationId: 'reg_null', reference: 'ref_null' }]);
  const response = paymentStorageService.getGatewayResponse('pay_null');
  const receipt = paymentStorageService.getReceiptByPayment('pay_null');
  expect(response.result).toBe('approved');
  expect(receipt.reference).toBe('ref_null');
});

test('payment storage returns null when no matching entries', () => {
  paymentStorage.write('cms.payment_gateway_responses', [{ paymentId: 'pay_other', result: 'approved' }]);
  paymentStorage.write('cms.payment_receipts', [{ paymentId: 'pay_other', registrationId: 'reg_other', reference: 'ref_other' }]);
  expect(paymentStorageService.getGatewayResponse('missing')).toBe(null);
  expect(paymentStorageService.getReceiptByPayment('missing')).toBe(null);
});
