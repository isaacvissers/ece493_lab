import { paymentStorageService } from './payment_storage_service.js';

export const paymentStatusService = {
  getPaymentStatus({ paymentId = null } = {}) {
    if (!paymentId) {
      return { ok: false, reason: 'missing_payment' };
    }
    const payment = paymentStorageService.getPayment(paymentId);
    if (!payment) {
      return { ok: false, reason: 'not_found' };
    }
    const receipt = paymentStorageService.getReceiptByPayment(paymentId);
    return { ok: true, payment, receipt };
  },
  getRegistrationStatus({ registrationId = null } = {}) {
    if (!registrationId) {
      return { ok: false, reason: 'missing_registration' };
    }
    const balance = paymentStorageService.getBalance(registrationId);
    if (!balance) {
      return { ok: false, reason: 'not_found' };
    }
    const payment = paymentStorageService.getPaymentByRegistration(registrationId);
    const receipt = paymentStorageService.getReceiptByRegistration(registrationId);
    return { ok: true, balance, payment, receipt };
  },
};
