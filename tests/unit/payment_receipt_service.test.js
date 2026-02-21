import { paymentReceiptService } from '../../src/services/payment_receipt_service.js';
import { paymentStorageService } from '../../src/services/payment_storage_service.js';

beforeEach(() => {
  paymentStorageService.reset();
});

test('payment receipt service returns null when payment missing', () => {
  const result = paymentReceiptService.createReceipt({ payment: null });
  expect(result).toBe(null);
});

test('payment receipt service handles missing input args', () => {
  const result = paymentReceiptService.createReceipt();
  expect(result).toBe(null);
});

test('payment receipt service stores receipt with defaults', () => {
  const result = paymentReceiptService.createReceipt({
    payment: {
      id: 'pay_rcpt',
      registrationId: 'reg_rcpt',
      amount: 55,
      currency: null,
    },
  });
  expect(result.reference).toBeTruthy();
  expect(result.currency).toBe('USD');
  const stored = paymentStorageService.getReceiptByPayment('pay_rcpt');
  expect(stored.reference).toBe(result.reference);
});
