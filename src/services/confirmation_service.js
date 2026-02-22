import { createStorageAdapter } from './storage_adapter.js';
import { createPaymentConfirmation } from '../models/payment_confirmation.js';
import { createRegistrationOrder } from '../models/registration_order.js';
import { auditLogger as defaultAuditLogger } from './audit_logger.js';
import { idempotencyStore as defaultIdempotencyStore } from './idempotency_store.js';
import { retryQueue as defaultRetryQueue } from './retry_queue.js';
import { reconciliationQueue as defaultReconciliationQueue } from './reconciliation_queue.js';
import { downstreamTrigger as defaultDownstreamTrigger } from './downstream_trigger.js';
import { verifyHmac } from './hmac.js';
import { isWithinWindow } from './time_window.js';
import { PAYMENT_CONFIRMATION_KEYS, REGISTRATION_STATUS, CONFIRMATION_RESULTS, AUDIT_OUTCOMES } from './payment_constants.js';
import { measure } from './perf_monitor.js';

const adapter = createStorageAdapter();
let sharedSecret = 'dev_shared_secret';
let failureMode = {
  confirmationStorage: false,
  statusUpdate: false,
};

function load(key) {
  return adapter.read(key, []);
}

function persist(key, value, shouldFail) {
  if (shouldFail) {
    throw new Error('storage_failure');
  }
  adapter.write(key, value);
}

function saveById(list, entry, idKey) {
  const next = list.slice();
  const index = next.findIndex((item) => item && item[idKey] === entry[idKey]);
  if (index === -1) {
    next.push(entry);
  } else {
    next[index] = entry;
  }
  return next;
}

function findOrder({ payload, orders }) {
  if (payload.order_id) {
    return orders.find((order) => order && order.order_id === payload.order_id) || null;
  }
  if (payload.payment_intent_id) {
    return orders.find((order) => order && order.payment_intent_id === payload.payment_intent_id) || null;
  }
  if (payload.attendee_ref) {
    return orders.find((order) => order && order.attendee_ref === payload.attendee_ref) || null;
  }
  return null;
}

function computeNextAttempt({ attempt = 1, now }) {
  const backoffMinutes = [1, 5, 15];
  const index = Math.min(attempt - 1, backoffMinutes.length - 1);
  const delayMs = backoffMinutes[index] * 60 * 1000;
  return new Date(now + delayMs).toISOString();
}

export const confirmationService = {
  setFailureMode({ confirmationStorage = false, statusUpdate = false } = {}) {
    failureMode = {
      confirmationStorage: Boolean(confirmationStorage),
      statusUpdate: Boolean(statusUpdate),
    };
  },
  setSharedSecret(secret) {
    sharedSecret = secret;
  },
  getSharedSecret() {
    return sharedSecret;
  },
  reset({
    auditLogger = defaultAuditLogger,
    idempotencyStore = defaultIdempotencyStore,
    retryQueue = defaultRetryQueue,
    reconciliationQueue = defaultReconciliationQueue,
    downstreamTrigger = defaultDownstreamTrigger,
  } = {}) {
    failureMode = { confirmationStorage: false, statusUpdate: false };
    sharedSecret = 'dev_shared_secret';
    adapter.remove(PAYMENT_CONFIRMATION_KEYS.confirmations);
    adapter.remove(PAYMENT_CONFIRMATION_KEYS.orders);
    auditLogger.reset();
    idempotencyStore.reset();
    retryQueue.reset();
    reconciliationQueue.reset();
    downstreamTrigger.reset();
  },
  saveOrder(order) {
    const normalized = createRegistrationOrder(order);
    const next = saveById(load(PAYMENT_CONFIRMATION_KEYS.orders), normalized, 'order_id');
    persist(PAYMENT_CONFIRMATION_KEYS.orders, next, false);
    return normalized;
  },
  getOrder(orderId) {
    return load(PAYMENT_CONFIRMATION_KEYS.orders)
      .find((order) => order && order.order_id === orderId) || null;
  },
  getOrders() {
    return load(PAYMENT_CONFIRMATION_KEYS.orders).slice();
  },
  getConfirmations() {
    return load(PAYMENT_CONFIRMATION_KEYS.confirmations).slice();
  },
  processConfirmation({
    payload,
    rawBody = null,
    signature,
    sourceChannel,
    now = new Date().toISOString(),
    auditLogger = defaultAuditLogger,
    idempotencyStore = defaultIdempotencyStore,
    retryQueue = defaultRetryQueue,
    reconciliationQueue = defaultReconciliationQueue,
    downstreamTrigger = defaultDownstreamTrigger,
  } = {}) {
    const outcome = measure({
      label: 'confirmation_processing',
      fn: () => {
        const body = rawBody || JSON.stringify(payload || {});
        const timestampNow = typeof now === 'number' ? now : Date.parse(now);
        if (!verifyHmac({ payload: body, signature, secret: sharedSecret })) {
          return { ok: false, result: CONFIRMATION_RESULTS.rejected, reason: 'invalid_signature' };
        }

        const requiredFields = ['transaction_id', 'amount', 'currency', 'timestamp', 'attendee_ref', 'status'];
        const missingField = requiredFields.find((field) => !payload || payload[field] === undefined || payload[field] === null);
        if (missingField) {
          return { ok: false, result: CONFIRMATION_RESULTS.rejected, reason: 'validation_failed', field: missingField };
        }

        if (!isWithinWindow({ timestamp: payload.timestamp, now })) {
          return { ok: false, result: CONFIRMATION_RESULTS.rejected, reason: 'validation_failed', field: 'timestamp' };
        }

        if (idempotencyStore.has(payload.transaction_id)) {
          const order = findOrder({ payload, orders: load(PAYMENT_CONFIRMATION_KEYS.orders) });
          return { ok: true, result: CONFIRMATION_RESULTS.duplicate, registration_status: order ? order.status : null };
        }

        const order = findOrder({ payload, orders: load(PAYMENT_CONFIRMATION_KEYS.orders) });
        if (!order) {
          reconciliationQueue.addUnmatched({
            transaction_id: payload.transaction_id,
            amount: payload.amount,
            currency: payload.currency,
            timestamp: payload.timestamp,
            attendee_ref: payload.attendee_ref,
            reason: 'no_matching_order',
            source_channel: sourceChannel || 'unknown',
          });
          auditLogger.logEvent({
            event_type: 'unmatched_confirmation',
            transaction_id: payload.transaction_id,
            outcome: AUDIT_OUTCOMES.failure,
            details: 'no_matching_order',
          });
          idempotencyStore.record({ transaction_id: payload.transaction_id, result: CONFIRMATION_RESULTS.rejected });
          return { ok: false, result: CONFIRMATION_RESULTS.rejected, reason: 'unmatched' };
        }

        if (Number.isFinite(order.amount) && order.amount !== payload.amount) {
          return { ok: false, result: CONFIRMATION_RESULTS.rejected, reason: 'validation_failed', field: 'amount' };
        }
        if (order.currency && order.currency !== payload.currency) {
          return { ok: false, result: CONFIRMATION_RESULTS.rejected, reason: 'validation_failed', field: 'currency' };
        }

        let confirmation;
        try {
          confirmation = createPaymentConfirmation({
            transaction_id: payload.transaction_id,
            order_id: payload.order_id || order.order_id,
            payment_intent_id: payload.payment_intent_id || order.payment_intent_id,
            amount: payload.amount,
            currency: payload.currency,
            timestamp: payload.timestamp,
            attendee_ref: payload.attendee_ref,
            status: payload.status,
            source_channel: sourceChannel || 'redirect',
          });
          const next = saveById(load(PAYMENT_CONFIRMATION_KEYS.confirmations), confirmation, 'transaction_id');
          persist(PAYMENT_CONFIRMATION_KEYS.confirmations, next, failureMode.confirmationStorage);
          auditLogger.logEvent({
            event_type: 'payment_confirmation_stored',
            transaction_id: confirmation.transaction_id,
            order_id: confirmation.order_id,
            outcome: AUDIT_OUTCOMES.success,
          });
        } catch (error) {
          reconciliationQueue.addUnmatched({
            transaction_id: payload.transaction_id,
            amount: payload.amount,
            currency: payload.currency,
            timestamp: payload.timestamp,
            attendee_ref: payload.attendee_ref,
            reason: 'storage_failed',
            source_channel: sourceChannel || 'unknown',
          });
          auditLogger.logEvent({
            event_type: 'payment_confirmation_storage_failed',
            transaction_id: payload.transaction_id,
            order_id: order.order_id,
            outcome: AUDIT_OUTCOMES.failure,
            details: 'storage_failed',
          });
          return { ok: false, result: CONFIRMATION_RESULTS.rejected, reason: 'storage_failed' };
        }

        idempotencyStore.record({ transaction_id: payload.transaction_id, result: CONFIRMATION_RESULTS.stored });

        if (failureMode.statusUpdate) {
          const nextAttemptAt = computeNextAttempt({ now: timestampNow });
          retryQueue.enqueue({
            transaction_id: payload.transaction_id,
            order_id: order.order_id,
            attempt: 1,
            nextAttemptAt,
          });
          auditLogger.logEvent({
            event_type: 'registration_status_update_failed',
            transaction_id: payload.transaction_id,
            order_id: order.order_id,
            outcome: AUDIT_OUTCOMES.failure,
            details: 'status_update_failed',
          });
          return { ok: false, result: CONFIRMATION_RESULTS.stored, reason: 'status_update_failed' };
        }

        const updatedOrder = {
          ...order,
          status: REGISTRATION_STATUS.paidConfirmed,
          paid_at: payload.timestamp,
          updated_at: new Date().toISOString(),
        };
        const orders = saveById(load(PAYMENT_CONFIRMATION_KEYS.orders), updatedOrder, 'order_id');
        persist(PAYMENT_CONFIRMATION_KEYS.orders, orders, false);

        auditLogger.logEvent({
          event_type: 'registration_status_updated',
          transaction_id: payload.transaction_id,
          order_id: order.order_id,
          outcome: AUDIT_OUTCOMES.success,
        });

        const triggerPayload = {
          transaction_id: payload.transaction_id,
          order_id: order.order_id,
          attendee_ref: order.attendee_ref,
          registration_status: updatedOrder.status,
          confirmation_timestamp: payload.timestamp,
        };
        const triggerResult = downstreamTrigger.dispatch({ payload: triggerPayload, auditLogger });
        if (!triggerResult.ok) {
          auditLogger.logEvent({
            event_type: 'downstream_trigger_failed',
            transaction_id: payload.transaction_id,
            order_id: order.order_id,
            outcome: AUDIT_OUTCOMES.failure,
            details: triggerResult.reason || 'trigger_failed',
          });
        }

        return {
          ok: true,
          result: CONFIRMATION_RESULTS.stored,
          registration_status: updatedOrder.status,
        };
      },
    });

    const result = outcome.result;
    result.performance = {
      durationMs: outcome.durationMs,
      exceeded: outcome.exceeded,
    };
    return result;
  },
};
