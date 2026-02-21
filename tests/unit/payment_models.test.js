import { createPaymentReceipt } from '../../src/models/payment_receipt.js';
import { createPaymentGatewayResponse, isAuthRequired } from '../../src/models/payment_gateway_response.js';
import { createRegistrationBalance } from '../../src/models/registration_balance.js';

test('payment receipt generates reference when missing', () => {
  const receipt = createPaymentReceipt({ paymentId: 'pay_1', registrationId: 'reg_1', amount: 100 });
  expect(receipt.reference).toBeTruthy();
  expect(receipt.currency).toBe('USD');
});

test('payment receipt defaults fields when no input provided', () => {
  const receipt = createPaymentReceipt();
  expect(receipt.currency).toBe('USD');
  expect(receipt.reference).toBeTruthy();
});
test('payment gateway response supports auth-required check', () => {
  const response = createPaymentGatewayResponse({ paymentId: 'pay_auth', result: 'requires_authentication' });
  expect(isAuthRequired(response)).toBe(true);
  expect(isAuthRequired({ result: 'approved' })).toBe(false);
});

test('payment gateway response defaults to approved result', () => {
  const response = createPaymentGatewayResponse();
  expect(response.result).toBe('approved');
});

test('registration balance defaults to unpaid', () => {
  const balance = createRegistrationBalance({ registrationId: 'reg_balance' });
  expect(balance.status).toBe('unpaid');
  expect(balance.amountDue).toBe(0);
});

test('registration balance defaults when no input provided', () => {
  const balance = createRegistrationBalance();
  expect(balance.status).toBe('unpaid');
});
