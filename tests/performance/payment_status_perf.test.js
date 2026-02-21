import { sessionState } from '../../src/models/session-state.js';
import { paymentStorageService } from '../../src/services/payment_storage_service.js';
import { createPaymentStatusView } from '../../src/views/payment_status_view.js';
import { createPaymentStatusController } from '../../src/controllers/payment_status_controller.js';

beforeEach(() => {
  sessionState.clear();
  paymentStorageService.reset();
  document.body.innerHTML = '';
});

test('payment status view responds within 2 seconds', () => {
  sessionState.authenticate({ id: 'acct_attendee', email: 'attendee@example.com' });
  paymentStorageService.saveBalance({
    registrationId: 'reg_perf',
    amountDue: 0,
    amountPaid: 100,
    status: 'confirmed',
  });
  paymentStorageService.savePayment({
    id: 'pay_perf',
    registrationId: 'reg_perf',
    amount: 100,
    status: 'captured',
    capturedAt: '2026-02-01T12:00:00.000Z',
    reference: 'ref_perf',
  });

  const view = createPaymentStatusView();
  const controller = createPaymentStatusController({ view });
  const start = Date.now();
  controller.show({ registrationId: 'reg_perf' });
  const elapsed = Date.now() - start;
  expect(elapsed).toBeLessThan(2000);
});
