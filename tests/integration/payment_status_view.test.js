import { sessionState } from '../../src/models/session-state.js';
import { paymentStorageService } from '../../src/services/payment_storage_service.js';
import { createPaymentStatusView } from '../../src/views/payment_status_view.js';
import { createPaymentStatusController } from '../../src/controllers/payment_status_controller.js';

beforeEach(() => {
  sessionState.clear();
  paymentStorageService.reset();
  document.body.innerHTML = '';
});

test('payment status view renders registration details', () => {
  sessionState.authenticate({ id: 'acct_attendee', email: 'attendee@example.com' });
  paymentStorageService.saveBalance({
    registrationId: 'reg_status',
    amountDue: 0,
    amountPaid: 200,
    status: 'confirmed',
  });
  paymentStorageService.savePayment({
    id: 'pay_status',
    registrationId: 'reg_status',
    amount: 200,
    status: 'captured',
    capturedAt: '2026-02-01T12:00:00.000Z',
    reference: 'ref_200',
  });

  const view = createPaymentStatusView();
  const controller = createPaymentStatusController({ view });
  controller.show({ registrationId: 'reg_status' });
  document.body.appendChild(view.element);

  expect(document.body.textContent).toContain('Payment status');
  expect(document.body.textContent).toContain('confirmed');
  expect(document.body.textContent).toContain('200');
});
