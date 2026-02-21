import { paymentStorage } from './storage.js';
import { createPayment } from '../models/payment.js';
import { createPaymentReceipt } from '../models/payment_receipt.js';
import { createPaymentGatewayResponse } from '../models/payment_gateway_response.js';
import { createRegistrationBalance } from '../models/registration_balance.js';

const PAYMENTS_KEY = 'cms.payments';
const RECEIPTS_KEY = 'cms.payment_receipts';
const RESPONSES_KEY = 'cms.payment_gateway_responses';
const BALANCES_KEY = 'cms.registration_balances';

let failureMode = false;

function load(key, fallback) {
  return paymentStorage.read(key, fallback);
}

function persist(key, value) {
  if (failureMode) {
    throw new Error('storage_failure');
  }
  paymentStorage.write(key, value);
}

function sanitizePayment(payment) {
  const copy = { ...payment };
  if (copy.cardNumber) {
    copy.cardLast4 = copy.cardNumber.slice(-4);
  }
  delete copy.cardNumber;
  delete copy.cvv;
  delete copy.expiryMonth;
  delete copy.expiryYear;
  delete copy.billingPostal;
  return copy;
}

function saveById(list, item, idKey = 'id') {
  const next = list.slice();
  const index = next.findIndex((entry) => entry && entry[idKey] === item[idKey]);
  if (index === -1) {
    next.push(item);
  } else {
    next[index] = item;
  }
  return next;
}

export const paymentStorageService = {
  setFailureMode(enabled) {
    failureMode = Boolean(enabled);
  },
  reset() {
    failureMode = false;
    paymentStorage.remove(PAYMENTS_KEY);
    paymentStorage.remove(RECEIPTS_KEY);
    paymentStorage.remove(RESPONSES_KEY);
    paymentStorage.remove(BALANCES_KEY);
  },
  getPayments() {
    return load(PAYMENTS_KEY, []).slice();
  },
  savePayment(payment) {
    const normalized = createPayment(sanitizePayment(payment));
    const next = saveById(load(PAYMENTS_KEY, []), normalized);
    persist(PAYMENTS_KEY, next);
    return normalized;
  },
  getPayment(paymentId) {
    return load(PAYMENTS_KEY, []).find((payment) => payment && payment.id === paymentId) || null;
  },
  getPaymentByRegistration(registrationId) {
    return load(PAYMENTS_KEY, []).find((payment) => payment && payment.registrationId === registrationId) || null;
  },
  getPaymentByIdempotencyKey(idempotencyKey) {
    return load(PAYMENTS_KEY, [])
      .find((payment) => payment && payment.idempotencyKey === idempotencyKey) || null;
  },
  saveGatewayResponse(response) {
    const normalized = createPaymentGatewayResponse(response);
    const next = saveById(load(RESPONSES_KEY, []), normalized, 'paymentId');
    persist(RESPONSES_KEY, next);
    return normalized;
  },
  getGatewayResponse(paymentId) {
    return load(RESPONSES_KEY, []).find((entry) => entry && entry.paymentId === paymentId) || null;
  },
  saveReceipt(receipt) {
    const normalized = createPaymentReceipt(receipt);
    const next = saveById(load(RECEIPTS_KEY, []), normalized, 'paymentId');
    persist(RECEIPTS_KEY, next);
    return normalized;
  },
  getReceiptByPayment(paymentId) {
    return load(RECEIPTS_KEY, []).find((entry) => entry && entry.paymentId === paymentId) || null;
  },
  getReceiptByRegistration(registrationId) {
    return load(RECEIPTS_KEY, [])
      .find((entry) => entry && entry.registrationId === registrationId) || null;
  },
  saveBalance(balance) {
    const normalized = createRegistrationBalance(balance);
    const next = saveById(load(BALANCES_KEY, []), normalized, 'registrationId');
    persist(BALANCES_KEY, next);
    return normalized;
  },
  getBalance(registrationId) {
    return load(BALANCES_KEY, [])
      .find((entry) => entry && entry.registrationId === registrationId) || null;
  },
};
