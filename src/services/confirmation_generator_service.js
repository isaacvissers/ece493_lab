import { createTicketReceipt } from '../models/ticket_receipt.js';
import { confirmationStorageService as defaultConfirmationStorageService } from './confirmation_storage_service.js';
import { paymentStorageService as defaultPaymentStorageService } from './payment_storage_service.js';
import { registrationService as defaultRegistrationService } from './registration_service.js';
import { deliveryLogService as defaultDeliveryLogService } from './delivery_log_service.js';
import { confirmationNotificationService as defaultConfirmationNotificationService } from './confirmation_notification_service.js';

let failureMode = false;

function resolveTicketType(attendanceType) {
  if (!attendanceType) {
    return '';
  }
  const normalized = attendanceType.toString().trim().toLowerCase();
  if (normalized === 'in_person' || normalized === 'in-person') {
    return 'In-person';
  }
  if (normalized === 'virtual') {
    return 'Virtual';
  }
  return attendanceType;
}

function isPaymentComplete(payment) {
  if (!payment) {
    return false;
  }
  return ['captured', 'success', 'not_required'].includes(payment.status);
}

export const confirmationGeneratorService = {
  setFailureMode(enabled) {
    failureMode = Boolean(enabled);
  },
  reset() {
    failureMode = false;
  },
  generateConfirmation({
    registrationId,
    now = new Date().toISOString(),
    registrationService = defaultRegistrationService,
    paymentStorageService = defaultPaymentStorageService,
    confirmationStorageService = defaultConfirmationStorageService,
    deliveryLogService = defaultDeliveryLogService,
    confirmationNotificationService = defaultConfirmationNotificationService,
  } = {}) {
    if (!registrationId) {
      return { ok: false, reason: 'missing_registration' };
    }

    const existingRecord = confirmationStorageService.getRecordByRegistration(registrationId);
    if (existingRecord && existingRecord.status === 'generated') {
      const existingReceipt = confirmationStorageService.getReceiptByRegistration(registrationId);
      return { ok: true, receipt: existingReceipt, record: existingRecord, generated: false };
    }

    const registration = registrationService.getRegistrationById
      ? registrationService.getRegistrationById(registrationId)
      : null;
    if (!registration) {
      return { ok: false, reason: 'not_found' };
    }

    const payment = paymentStorageService.getPaymentByRegistration(registrationId);
    if (!isPaymentComplete(payment)) {
      return { ok: false, reason: 'payment_incomplete' };
    }

    if (existingRecord && existingRecord.status === 'pending') {
      deliveryLogService.logRetry({ registrationId, reason: 'pending_retry' });
    }

    if (failureMode) {
      try {
        const pendingRecord = confirmationStorageService.saveRecord({
          registrationId,
          status: 'pending',
        });
        deliveryLogService.logRetry({ registrationId, reason: 'generation_failed' });
        return { ok: false, reason: 'pending', record: pendingRecord };
      } catch (error) {
        return { ok: false, reason: 'storage_failed' };
      }
    }

    const paymentReceipt = paymentStorageService.getReceiptByRegistration(registrationId);
    const receipt = createTicketReceipt({
      registrationId,
      conferenceName: 'Conference Registration',
      attendeeName: registration.name || '',
      ticketType: resolveTicketType(registration.attendanceType),
      amountPaid: paymentReceipt ? paymentReceipt.amount : payment.amount || 0,
      transactionReference: paymentReceipt && paymentReceipt.reference
        ? paymentReceipt.reference
        : payment.reference || payment.providerRef || null,
      issuedAt: paymentReceipt && paymentReceipt.paidAt ? paymentReceipt.paidAt : now,
    });

    let storedReceipt;
    let record;
    try {
      storedReceipt = confirmationStorageService.saveReceipt(receipt);
      record = confirmationStorageService.saveRecord({
        registrationId,
        receiptId: storedReceipt.id,
        status: 'generated',
      });
    } catch (error) {
      try {
        deliveryLogService.logRetry({ registrationId, reason: 'storage_failed' });
      } catch (logError) {
        return { ok: false, reason: 'storage_failed' };
      }
      return { ok: false, reason: 'storage_failed' };
    }

    const notification = confirmationNotificationService.sendConfirmation({
      registrationId,
      receipt: storedReceipt,
      deliveryLogService,
    });

    return {
      ok: true,
      receipt: storedReceipt,
      record,
      notification,
      generated: true,
    };
  },
};
