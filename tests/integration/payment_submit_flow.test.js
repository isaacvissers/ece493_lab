import { paymentService } from '../../src/services/payment_service.js';
import { paymentGatewayService } from '../../src/services/payment_gateway_service.js';
import { paymentStorageService } from '../../src/services/payment_storage_service.js';
import { paymentNotificationService } from '../../src/services/payment_notification_service.js';

beforeEach(() => {
  paymentService.reset();
  paymentGatewayService.reset();
  paymentStorageService.reset();
  paymentNotificationService.reset();
});

test('payment submission authorizes, captures, and stores receipt', () => {
  const result = paymentService.submitCardPayment({
    registrationId: 'reg_flow',
    amount: 200,
    currency: 'USD',
    cardholderName: 'Ada Lovelace',
    cardNumber: '4242424242424242',
    expiryMonth: '11',
    expiryYear: '2030',
    cvv: '123',
    billingPostal: '12345',
    idempotencyKey: 'idem_flow',
  });

  expect(result.ok).toBe(true);
  expect(result.receipt).toBeTruthy();
  expect(result.notification.ok).toBe(true);

  const stored = paymentStorageService.getPaymentByRegistration('reg_flow');
  const receipt = paymentStorageService.getReceiptByRegistration('reg_flow');
  expect(stored.status).toBe('captured');
  expect(receipt.reference).toBeTruthy();
});
