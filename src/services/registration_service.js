import { registrationStorage } from './storage.js';
import { createRegistration } from '../models/registration.js';
import { paymentService as defaultPaymentService } from './payment_service.js';
import { registrationWindowService as defaultRegistrationWindowService } from './registration_window_service.js';
import { notificationService as defaultNotificationService } from './notification_service.js';
import { registrationLogService as defaultRegistrationLogService } from './registration_log_service.js';

const REGISTRATIONS_KEY = 'cms.registrations';

let failureMode = false;

function loadRegistrations() {
  return registrationStorage.read(REGISTRATIONS_KEY, []);
}

function persistRegistrations(registrations) {
  if (failureMode) {
    throw new Error('storage_failure');
  }
  registrationStorage.write(REGISTRATIONS_KEY, registrations);
}

function findRegistrationByUser(userId) {
  return loadRegistrations().find((registration) => registration && registration.userId === userId) || null;
}

function findRegistrationById(registrationId) {
  return loadRegistrations().find((registration) => registration && registration.id === registrationId) || null;
}

function saveRegistration(registration) {
  const registrations = loadRegistrations().slice();
  const index = registrations.findIndex((entry) => entry && entry.id === registration.id);
  if (index === -1) {
    registrations.push(registration);
  } else {
    registrations[index] = registration;
  }
  persistRegistrations(registrations);
  return registration;
}

function isValidEmail(email) {
  if (!email) {
    return false;
  }
  return /.+@.+\..+/.test(email);
}

function normalizeAttendanceType(value) {
  const normalized = (value || '').toString().trim().toLowerCase();
  if (['in_person', 'in-person', 'in person'].includes(normalized)) {
    return 'in_person';
  }
  if (['virtual', 'remote'].includes(normalized)) {
    return 'virtual';
  }
  return null;
}

function validateRegistration(values = {}) {
  const errors = {};
  const name = (values.name || '').trim();
  const affiliation = (values.affiliation || '').trim();
  const contactEmail = (values.contactEmail || '').trim();
  const attendanceType = normalizeAttendanceType(values.attendanceType);

  if (!name) {
    errors.name = 'required';
  }
  if (!affiliation) {
    errors.affiliation = 'required';
  }
  if (!contactEmail) {
    errors.contactEmail = 'required';
  } else if (!isValidEmail(contactEmail)) {
    errors.contactEmail = 'invalid';
  }
  if (!attendanceType) {
    errors.attendanceType = 'required';
  }

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    values: {
      name,
      affiliation,
      contactEmail,
      attendanceType,
    },
  };
}

function buildReceipt(registration, payment) {
  if (!registration) {
    return null;
  }
  let paymentStatus = 'pending';
  if (payment && payment.status === 'not_required') {
    paymentStatus = 'not_required';
  } else if (payment && payment.status === 'success') {
    paymentStatus = 'succeeded';
  } else if (payment && payment.status === 'failure') {
    paymentStatus = 'failed';
  }
  return {
    name: registration.name,
    affiliation: registration.affiliation,
    attendanceType: registration.attendanceType,
    registrationStatus: registration.status,
    paymentStatus,
  };
}

export const registrationService = {
  setFailureMode(enabled) {
    failureMode = Boolean(enabled);
  },
  reset() {
    failureMode = false;
    registrationStorage.remove(REGISTRATIONS_KEY);
  },
  getRegistrationForUser(userId) {
    return findRegistrationByUser(userId);
  },
  getRegistrationStatus({ userId, paymentService = defaultPaymentService } = {}) {
    const registration = findRegistrationByUser(userId);
    if (!registration) {
      return { ok: false, reason: 'not_found' };
    }
    const payment = paymentService.getPayment(registration.id);
    return { ok: true, registration, payment, receipt: buildReceipt(registration, payment) };
  },
  submitRegistration({
    userId,
    values,
    now = new Date().toISOString(),
    paymentService = defaultPaymentService,
    registrationWindowService = defaultRegistrationWindowService,
    notificationService = defaultNotificationService,
    registrationLogService = defaultRegistrationLogService,
  } = {}) {
    if (!userId) {
      return { ok: false, reason: 'unauthenticated' };
    }
    const nowValue = typeof now === 'number' ? now : Date.parse(now);
    const window = registrationWindowService.getWindow(Number.isNaN(nowValue) ? Date.now() : nowValue);
    if (!window.isOpen) {
      return { ok: false, reason: 'closed', window };
    }
    const existing = findRegistrationByUser(userId);
    if (existing) {
      const payment = paymentService.getPayment(existing.id);
      return {
        ok: false,
        reason: 'duplicate',
        registration: existing,
        payment,
        receipt: buildReceipt(existing, payment),
      };
    }

    const validation = validateRegistration(values);
    if (!validation.ok) {
      return { ok: false, reason: 'validation', errors: validation.errors };
    }

    const draft = createRegistration({
      userId,
      status: 'PendingPayment',
      name: validation.values.name,
      affiliation: validation.values.affiliation,
      contactEmail: validation.values.contactEmail,
      attendanceType: validation.values.attendanceType,
      createdAt: now,
      updatedAt: now,
    });

    const paymentResult = paymentService.processPayment({
      registrationId: draft.id,
      amount: paymentService.getRegistrationFee(),
    });

    if (!paymentResult.ok && paymentResult.reason === 'missing_registration') {
      return { ok: false, reason: 'payment_error' };
    }

    const payment = paymentResult.payment || null;
    if (!paymentResult.ok) {
      const pending = {
        ...draft,
        status: 'PendingPayment',
        updatedAt: now,
      };
      try {
        saveRegistration(pending);
      } catch (error) {
        registrationLogService.logSaveFailure({
          registrationId: draft.id,
          message: error && error.message ? error.message : 'save_failed',
        });
        return { ok: false, reason: 'save_failed' };
      }
      return {
        ok: false,
        reason: 'payment_failed',
        registration: pending,
        payment,
        receipt: buildReceipt(pending, payment),
      };
    }

    const completed = {
      ...draft,
      status: 'Registered',
      updatedAt: now,
    };

    try {
      saveRegistration(completed);
    } catch (error) {
      registrationLogService.logSaveFailure({
        registrationId: draft.id,
        message: error && error.message ? error.message : 'save_failed',
      });
      return { ok: false, reason: 'save_failed' };
    }

    const notificationResult = notificationService.sendRegistrationConfirmation({
      registration: completed,
      channels: ['email', 'in_app'],
    });
    if (!notificationResult.ok) {
      registrationLogService.logNotificationFailure({
        registrationId: completed.id,
        message: notificationResult.reason || 'notification_failed',
      });
    }

    return {
      ok: true,
      registration: completed,
      payment,
      receipt: buildReceipt(completed, payment),
      notification: notificationResult,
    };
  },
  retryPayment({
    userId,
    now = new Date().toISOString(),
    paymentService = defaultPaymentService,
    notificationService = defaultNotificationService,
    registrationLogService = defaultRegistrationLogService,
  } = {}) {
    const registration = findRegistrationByUser(userId);
    if (!registration) {
      return { ok: false, reason: 'not_found' };
    }
    const paymentResult = paymentService.retryPayment({ registrationId: registration.id });
    const payment = paymentResult.payment || null;
    if (!paymentResult.ok) {
      return {
        ok: false,
        reason: paymentResult.reason || 'payment_failed',
        registration,
        payment,
        receipt: buildReceipt(registration, payment),
      };
    }
    if (registration.status === 'Registered') {
      return {
        ok: true,
        registration,
        payment,
        receipt: buildReceipt(registration, payment),
        alreadyRegistered: true,
      };
    }
    const updated = {
      ...registration,
      status: 'Registered',
      updatedAt: now,
    };
    try {
      saveRegistration(updated);
    } catch (error) {
      registrationLogService.logSaveFailure({
        registrationId: updated.id,
        message: error && error.message ? error.message : 'save_failed',
      });
      return { ok: false, reason: 'save_failed' };
    }
    const notificationResult = notificationService.sendRegistrationConfirmation({
      registration: updated,
      channels: ['email', 'in_app'],
    });
    if (!notificationResult.ok) {
      registrationLogService.logNotificationFailure({
        registrationId: updated.id,
        message: notificationResult.reason || 'notification_failed',
      });
    }
    return {
      ok: true,
      registration: updated,
      payment,
      receipt: buildReceipt(updated, payment),
      notification: notificationResult,
    };
  },
};

export const __testOnly = {
  findRegistrationById,
  isValidEmail,
  buildReceipt,
  validateRegistration,
  normalizeAttendanceType,
};
