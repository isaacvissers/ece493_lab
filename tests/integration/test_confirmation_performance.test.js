import { confirmationService } from '../../src/services/confirmation_service.js';
import { computeHmac } from '../../src/services/hmac.js';

beforeEach(() => {
  confirmationService.reset();
});

test('confirmation processing completes within 200 ms', () => {
  confirmationService.saveOrder({
    order_id: 'ord_perf',
    attendee_ref: 'att_perf',
    amount: 20,
    currency: 'USD',
    status: 'pending',
  });
  const payload = {
    transaction_id: 'tx_perf',
    order_id: 'ord_perf',
    amount: 20,
    currency: 'USD',
    timestamp: new Date().toISOString(),
    attendee_ref: 'att_perf',
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
  expect(result.performance.durationMs).toBeLessThanOrEqual(200);
});
