import { registrationStorage } from './storage.js';
import { createPayment } from '../models/payment.js';

const PAYMENTS_KEY = 'cms.registration_payments';

let failureMode = false;
let retryFailureMode = false;
let registrationFee = 100;

function loadPayments() {
  return registrationStorage.read(PAYMENTS_KEY, []);
}

function persistPayments(payments) {
  registrationStorage.write(PAYMENTS_KEY, payments);
}

function savePayment(payment) {
  const payments = loadPayments().slice();
  const index = payments.findIndex((entry) => entry && entry.id === payment.id);
  if (index === -1) {
    payments.push(payment);
  } else {
    payments[index] = payment;
  }
  persistPayments(payments);
  return payment;
}

function findPaymentByRegistration(registrationId) {
  return loadPayments().find((payment) => payment && payment.registrationId === registrationId) || null;
}

export const paymentService = {
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
  getPayment(registrationId) {
    return findPaymentByRegistration(registrationId);
  },
  processPayment({ registrationId, amount } = {}) {
    const chargeAmount = Number.isFinite(amount) ? amount : registrationFee;
    if (!registrationId) {
      return { ok: false, reason: 'missing_registration' };
    }
    if (chargeAmount === 0) {
      const payment = savePayment(createPayment({
        registrationId,
        amount: chargeAmount,
        status: 'not_required',
        providerRef: 'not_required',
      }));
      return { ok: true, payment, required: false };
    }
    if (failureMode) {
      const payment = savePayment(createPayment({
        registrationId,
        amount: chargeAmount,
        status: 'failure',
        providerRef: 'failed_charge',
      }));
      return { ok: false, reason: 'payment_failed', payment, required: true };
    }
    const payment = savePayment(createPayment({
      registrationId,
      amount: chargeAmount,
      status: 'success',
      providerRef: 'paid',
    }));
    return { ok: true, payment, required: true };
  },
  retryPayment({ registrationId } = {}) {
    if (!registrationId) {
      return { ok: false, reason: 'missing_registration' };
    }
    const existing = findPaymentByRegistration(registrationId);
    if (!existing) {
      return { ok: false, reason: 'not_found' };
    }
    if (existing.status !== 'failure' && existing.status !== 'cancelled') {
      return { ok: true, payment: existing, alreadyPaid: true };
    }
    if (retryFailureMode) {
      const failed = savePayment({
        ...existing,
        status: 'failure',
        providerRef: 'retry_failed',
      });
      return { ok: false, reason: 'payment_failed', payment: failed };
    }
    const payment = savePayment({
      ...existing,
      status: 'success',
      providerRef: 'paid',
    });
    return { ok: true, payment };
  },
  reset() {
    failureMode = false;
    retryFailureMode = false;
    registrationFee = 100;
    registrationStorage.remove(PAYMENTS_KEY);
  },
};
