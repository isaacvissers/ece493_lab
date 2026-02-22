import { confirmationStorage } from './storage.js';
import { createTicketReceipt } from '../models/ticket_receipt.js';
import { createConfirmationRecord } from '../models/confirmation_record.js';
import { createDeliveryLog } from '../models/delivery_log.js';

const RECEIPTS_KEY = 'cms.confirmation_receipts';
const RECORDS_KEY = 'cms.confirmation_records';
const DELIVERY_KEY = 'cms.confirmation_delivery_logs';

let failureMode = false;

function load(key, fallback) {
  return confirmationStorage.read(key, fallback);
}

function persist(key, value) {
  if (failureMode) {
    throw new Error('storage_failure');
  }
  confirmationStorage.write(key, value);
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

export const confirmationStorageService = {
  setFailureMode(enabled) {
    failureMode = Boolean(enabled);
  },
  reset() {
    failureMode = false;
    confirmationStorage.remove(RECEIPTS_KEY);
    confirmationStorage.remove(RECORDS_KEY);
    confirmationStorage.remove(DELIVERY_KEY);
  },
  getReceipts() {
    return load(RECEIPTS_KEY, []).slice();
  },
  saveReceipt(receipt) {
    const normalized = createTicketReceipt(receipt);
    const next = saveById(load(RECEIPTS_KEY, []), normalized, 'registrationId');
    persist(RECEIPTS_KEY, next);
    return normalized;
  },
  getReceiptByRegistration(registrationId) {
    return load(RECEIPTS_KEY, [])
      .find((entry) => entry && entry.registrationId === registrationId) || null;
  },
  getRecords() {
    return load(RECORDS_KEY, []).slice();
  },
  saveRecord(record) {
    const normalized = createConfirmationRecord(record);
    const next = saveById(load(RECORDS_KEY, []), normalized, 'registrationId');
    persist(RECORDS_KEY, next);
    return normalized;
  },
  getRecordByRegistration(registrationId) {
    return load(RECORDS_KEY, [])
      .find((entry) => entry && entry.registrationId === registrationId) || null;
  },
  saveDeliveryLog(entry) {
    const normalized = createDeliveryLog(entry);
    const next = saveById(load(DELIVERY_KEY, []), normalized);
    persist(DELIVERY_KEY, next);
    return normalized;
  },
  getDeliveryLogs(registrationId) {
    const logs = load(DELIVERY_KEY, []);
    if (!registrationId) {
      return logs.slice();
    }
    return logs.filter((entry) => entry && entry.registrationId === registrationId);
  },
};
