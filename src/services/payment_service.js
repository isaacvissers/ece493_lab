import { createPayment } from '../models/payment.js';
import { paymentStorageService as defaultPaymentStorageService } from './payment_storage_service.js';
import { paymentGatewayService as defaultPaymentGatewayService } from './payment_gateway_service.js';
import { paymentValidationService as defaultPaymentValidationService } from './payment_validation_service.js';
import { paymentReceiptService as defaultPaymentReceiptService } from './payment_receipt_service.js';
import { paymentNotificationService as defaultPaymentNotificationService } from './payment_notification_service.js';
import { paymentReconciliationService as defaultPaymentReconciliationService } from './payment_reconciliation_service.js';

let failureMode = false;
let retryFailureMode = false;
let registrationFee = 100;

export const paymentService = {
  setPersistenceFailureMode(enabled, paymentStorageService = defaultPaymentStorageService) {
    paymentStorageService.setFailureMode(enabled);
  },
  setFailureMode({ initial = false, retry = false } = {}) {
    failureMode = Boolean(initial);
    retryFailureMode = Boolean(retry);
  },
  setRegistrationFee(amount) {
    registrationFee = Number.isFinite(amount) ? amount : registrationFee;
  },
  getRegistrationFee() {
    return registrationFee;
  },
  getPayment(registrationId, paymentStorageService = defaultPaymentStorageService) {
    return paymentStorageService.getPaymentByRegistration(registrationId);
  },
  processPayment({ registrationId, amount, paymentStorageService = defaultPaymentStorageService } = {}) {
    const chargeAmount = Number.isFinite(amount) ? amount : registrationFee;
    if (!registrationId) {
      return { ok: false, reason: 'missing_registration' };
    }
    if (chargeAmount === 0) {
      const payment = paymentStorageService.savePayment(createPayment({
        registrationId,
        amount: chargeAmount,
        status: 'not_required',
        providerRef: 'not_required',
      }));
      return { ok: true, payment, required: false };
    }
    if (failureMode) {
      const payment = paymentStorageService.savePayment(createPayment({
        registrationId,
        amount: chargeAmount,
        status: 'failure',
        providerRef: 'failed_charge',
      }));
      return { ok: false, reason: 'payment_failed', payment, required: true };
    }
    const payment = paymentStorageService.savePayment(createPayment({
      registrationId,
      amount: chargeAmount,
      status: 'success',
      providerRef: 'paid',
    }));
    return { ok: true, payment, required: true };
  },
  retryPayment({ registrationId, paymentStorageService = defaultPaymentStorageService } = {}) {
    if (!registrationId) {
      return { ok: false, reason: 'missing_registration' };
    }
    const existing = paymentStorageService.getPaymentByRegistration(registrationId);
    if (!existing) {
      return { ok: false, reason: 'not_found' };
    }
    if (existing.status !== 'failure' && existing.status !== 'cancelled') {
      return { ok: true, payment: existing, alreadyPaid: true };
    }
    if (retryFailureMode) {
      const failed = paymentStorageService.savePayment({
        ...existing,
        status: 'failure',
        providerRef: 'retry_failed',
      });
      return { ok: false, reason: 'payment_failed', payment: failed };
    }
    const payment = paymentStorageService.savePayment({
      ...existing,
      status: 'success',
      providerRef: 'paid',
    });
    return { ok: true, payment };
  },
  submitCardPayment({
    registrationId,
    amount,
    currency = 'USD',
    cardholderName,
    cardNumber,
    expiryMonth,
    expiryYear,
    cvv,
    billingPostal,
    idempotencyKey,
    now = new Date().toISOString(),
    paymentStorageService = defaultPaymentStorageService,
    paymentGatewayService = defaultPaymentGatewayService,
    paymentValidationService = defaultPaymentValidationService,
    paymentReceiptService = defaultPaymentReceiptService,
    paymentNotificationService = defaultPaymentNotificationService,
    paymentReconciliationService = defaultPaymentReconciliationService,
  } = {}) {
    const validation = paymentValidationService.validate({
      registrationId,
      amount,
      currency,
      cardholderName,
      cardNumber,
      expiryMonth,
      expiryYear,
      cvv,
      billingPostal,
      idempotencyKey,
    });
    if (!validation.ok) {
      return { ok: false, reason: 'validation', errors: validation.errors };
    }

    if (Number(amount) === 0) {
      const payment = paymentStorageService.savePayment(createPayment({
        registrationId,
        amount: 0,
        currency,
        status: 'captured',
        idempotencyKey,
        attemptedAt: now,
        capturedAt: now,
        reference: 'bypass',
      }));
      paymentStorageService.saveBalance({
        registrationId,
        amountDue: 0,
        amountPaid: 0,
        status: 'confirmed',
      });
      const receipt = paymentReceiptService.createReceipt({ payment });
      return { ok: true, payment, receipt, bypass: true };
    }

    const duplicate = paymentStorageService.getPaymentByIdempotencyKey(idempotencyKey);
    if (duplicate) {
      return { ok: false, reason: 'duplicate', payment: duplicate };
    }

    const payment = paymentStorageService.savePayment(createPayment({
      registrationId,
      amount,
      currency,
      status: 'authorized',
      idempotencyKey,
      attemptedAt: now,
      cardLast4: cardNumber ? cardNumber.slice(-4) : null,
    }));

    const authResponse = paymentGatewayService.authorize({ paymentId: payment.id, amount, currency });
    paymentStorageService.saveGatewayResponse(authResponse);

    if (authResponse.result === 'requires_authentication') {
      const pending = paymentStorageService.savePayment({
        ...payment,
        status: 'pending_confirmation',
      });
      return { ok: false, reason: 'auth_required', payment: pending, nextAction: authResponse.nextAction };
    }

    if (authResponse.result !== 'approved') {
      const failed = paymentStorageService.savePayment({
        ...payment,
        status: authResponse.result === 'declined' ? 'declined' : 'failed',
      });
      return { ok: false, reason: authResponse.result, payment: failed };
    }

    const captureResponse = paymentGatewayService.capture({ paymentId: payment.id });
    paymentStorageService.saveGatewayResponse(captureResponse);
    if (captureResponse.result !== 'approved') {
      const failed = paymentStorageService.savePayment({
        ...payment,
        status: 'failed',
      });
      return { ok: false, reason: captureResponse.result, payment: failed };
    }

    const captured = {
      ...payment,
      status: 'captured',
      capturedAt: now,
      reference: payment.reference || `pay_${payment.id}`,
    };

    let saved;
    try {
      saved = paymentStorageService.savePayment(captured);
      paymentStorageService.saveBalance({
        registrationId,
        amountDue: 0,
        amountPaid: Number(amount),
        status: 'confirmed',
      });
    } catch (error) {
      paymentReconciliationService.flag({
        paymentId: captured.id,
        registrationId,
        reason: 'persistence_failure',
      });
      return { ok: false, reason: 'persistence_failure', payment: captured };
    }

    const receipt = paymentReceiptService.createReceipt({ payment: saved });
    const notification = paymentNotificationService.sendPaymentConfirmation({
      registrationId,
      receipt,
    });
    return { ok: true, payment: saved, receipt, notification };
  },
  completeAuthentication({
    paymentId,
    success = true,
    now = new Date().toISOString(),
    paymentStorageService = defaultPaymentStorageService,
    paymentGatewayService = defaultPaymentGatewayService,
    paymentReceiptService = defaultPaymentReceiptService,
    paymentNotificationService = defaultPaymentNotificationService,
  } = {}) {
    const existing = paymentStorageService.getPayment(paymentId);
    if (!existing) {
      return { ok: false, reason: 'not_found' };
    }
    const authResponse = paymentGatewayService.completeAuthentication({ paymentId, success });
    paymentStorageService.saveGatewayResponse(authResponse);
    if (authResponse.result !== 'approved') {
      const failed = paymentStorageService.savePayment({
        ...existing,
        status: 'failed',
      });
      return { ok: false, reason: 'auth_failed', payment: failed };
    }

    const captured = paymentStorageService.savePayment({
      ...existing,
      status: 'captured',
      capturedAt: now,
      reference: existing.reference || `pay_${existing.id}`,
    });
    const receipt = paymentReceiptService.createReceipt({ payment: captured });
    const notification = paymentNotificationService.sendPaymentConfirmation({
      registrationId: captured.registrationId,
      receipt,
    });
    return { ok: true, payment: captured, receipt, notification };
  },
  reset() {
    failureMode = false;
    retryFailureMode = false;
    registrationFee = 100;
    defaultPaymentStorageService.reset();
    defaultPaymentGatewayService.reset();
    defaultPaymentNotificationService.reset();
    defaultPaymentReconciliationService.reset();
  },
};
