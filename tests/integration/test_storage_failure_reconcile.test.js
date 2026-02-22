import { confirmationService } from '../../src/services/confirmation_service.js';
import { reconciliationQueue } from '../../src/services/reconciliation_queue.js';
import { computeHmac } from '../../src/services/hmac.js';

beforeEach(() => {
  confirmationService.reset();
  reconciliationQueue.reset();
});

test('storage failure writes to reconciliation queue', () => {
  confirmationService.saveOrder({
    order_id: 'ord_store',
    attendee_ref: 'att_store',
    amount: 55,
    currency: 'USD',
    status: 'pending',
  });
  confirmationService.setFailureMode({ confirmationStorage: true });
  const payload = {
    transaction_id: 'tx_store',
    order_id: 'ord_store',
    amount: 55,
    currency: 'USD',
    timestamp: new Date().toISOString(),
    attendee_ref: 'att_store',
    status: 'confirmed',
  };
  const rawBody = JSON.stringify(payload);
  const signature = computeHmac(rawBody, confirmationService.getSharedSecret());
  const result = confirmationService.processConfirmation({
    payload,
    rawBody,
    signature,
    sourceChannel: 'redirect',
  });
  expect(result.ok).toBe(false);
  expect(reconciliationQueue.getAll()).toHaveLength(1);
});
