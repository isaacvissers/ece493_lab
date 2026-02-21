import { paymentReconciliationService } from '../../src/services/payment_reconciliation_service.js';

beforeEach(() => {
  paymentReconciliationService.reset();
});

test('payment reconciliation flags persistence failures', () => {
  const flagged = paymentReconciliationService.flag();
  expect(flagged.reason).toBe('persistence_failure');
  const flags = paymentReconciliationService.getFlags();
  expect(flags).toHaveLength(1);
});
