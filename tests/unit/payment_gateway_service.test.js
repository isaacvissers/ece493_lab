import { paymentGatewayService } from '../../src/services/payment_gateway_service.js';

beforeEach(() => {
  paymentGatewayService.reset();
});

test('authorize defaults to approved result', () => {
  const response = paymentGatewayService.authorize({ paymentId: 'pay_1' });
  expect(response.result).toBe('approved');
  expect(response.nextAction).toBe(null);
});

test('authorize handles missing args', () => {
  const response = paymentGatewayService.authorize();
  expect(response.paymentId).toBe(null);
  expect(response.result).toBe('approved');
});

test('authorize can require authentication', () => {
  paymentGatewayService.setNextResult('requires_authentication');
  const response = paymentGatewayService.authorize({ paymentId: 'pay_auth' });
  expect(response.result).toBe('requires_authentication');
  expect(response.nextAction).toBe('3ds');
});

test('authorize supports explicit reason argument', () => {
  paymentGatewayService.setNextResult('declined', 'issuer_declined');
  const response = paymentGatewayService.authorize({ paymentId: 'pay_decline' });
  expect(response.reason).toBe('issuer_declined');
});

test('authorize uses default reason when none provided', () => {
  paymentGatewayService.setNextResult('approved');
  const response = paymentGatewayService.authorize({ paymentId: 'pay_default' });
  expect(response.reason).toBe(null);
});

test('capture can return non-approved result', () => {
  paymentGatewayService.setNextCaptureResult('error');
  const response = paymentGatewayService.capture({ paymentId: 'pay_capture' });
  expect(response.result).toBe('error');
});

test('capture handles missing args', () => {
  const response = paymentGatewayService.capture();
  expect(response.paymentId).toBe(null);
  expect(response.result).toBe('approved');
});

test('capture supports explicit reason argument', () => {
  paymentGatewayService.setNextCaptureResult('timeout', 'gateway_timeout');
  const response = paymentGatewayService.capture({ paymentId: 'pay_timeout' });
  expect(response.reason).toBe('gateway_timeout');
});

test('capture uses default reason when none provided', () => {
  paymentGatewayService.setNextCaptureResult('approved');
  const response = paymentGatewayService.capture({ paymentId: 'pay_capture_default' });
  expect(response.reason).toBe(null);
});

test('setAuthOutcome defaults to approved when success omitted', () => {
  paymentGatewayService.setAuthOutcome('pay_auth_default');
  const response = paymentGatewayService.completeAuthentication({ paymentId: 'pay_auth_default' });
  expect(response.result).toBe('approved');
});

test('completeAuthentication respects stored outcome', () => {
  paymentGatewayService.setAuthOutcome('pay_3ds', false);
  const response = paymentGatewayService.completeAuthentication({ paymentId: 'pay_3ds' });
  expect(response.result).toBe('declined');
});

test('completeAuthentication handles missing args', () => {
  const response = paymentGatewayService.completeAuthentication();
  expect(response.paymentId).toBe(null);
  expect(response.result).toBe('approved');
});

test('completeAuthentication defaults to approved when success true', () => {
  const response = paymentGatewayService.completeAuthentication({ paymentId: 'pay_ok', success: true });
  expect(response.result).toBe('approved');
});

test('completeAuthentication defaults to success arg when stored outcome missing', () => {
  const response = paymentGatewayService.completeAuthentication({ paymentId: 'pay_fail', success: false });
  expect(response.result).toBe('declined');
  expect(response.reason).toBe('authentication_failed');
});
