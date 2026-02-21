import { createPaymentReceipt } from '../models/payment_receipt.js';
import { paymentStorageService } from './payment_storage_service.js';

export const paymentReceiptService = {
  createReceipt({ payment } = {}) {
    if (!payment) {
      return null;
    }
    const receipt = createPaymentReceipt({
      paymentId: payment.id,
      registrationId: payment.registrationId,
      amount: payment.amount,
      currency: payment.currency || 'USD',
      paidAt: payment.capturedAt || new Date().toISOString(),
      reference: payment.reference || null,
    });
    return paymentStorageService.saveReceipt(receipt);
  },
};
