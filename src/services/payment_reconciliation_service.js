import { paymentStorage } from './storage.js';

const RECONCILIATION_KEY = 'cms.payment_reconciliation_flags';

function loadFlags() {
  return paymentStorage.read(RECONCILIATION_KEY, []);
}

function persistFlags(flags) {
  paymentStorage.write(RECONCILIATION_KEY, flags);
}

export const paymentReconciliationService = {
  reset() {
    paymentStorage.remove(RECONCILIATION_KEY);
  },
  flag({ paymentId = null, registrationId = null, reason = 'persistence_failure' } = {}) {
    const flags = loadFlags().slice();
    flags.push({
      paymentId,
      registrationId,
      reason,
      createdAt: new Date().toISOString(),
    });
    persistFlags(flags);
    return flags[flags.length - 1];
  },
  getFlags() {
    return loadFlags().slice();
  },
};
