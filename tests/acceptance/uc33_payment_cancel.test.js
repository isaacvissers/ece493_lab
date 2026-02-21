import { sessionState } from '../../src/models/session-state.js';
import { paymentService } from '../../src/services/payment_service.js';
import { paymentStorageService } from '../../src/services/payment_storage_service.js';
import { createPaymentFormView } from '../../src/views/payment_form_view.js';
import { createPaymentController } from '../../src/controllers/payment_controller.js';

beforeEach(() => {
  sessionState.clear();
  paymentService.reset();
  paymentStorageService.reset();
  document.body.innerHTML = '';
});

test('attendee can cancel before submitting payment', () => {
  sessionState.authenticate({ id: 'acct_attendee', email: 'attendee@example.com' });
  const view = createPaymentFormView();
  const controller = createPaymentController({ view });
  controller.init();
  controller.show({ registrationId: 'reg_cancel', amount: 75, currency: 'USD' });
  document.body.appendChild(view.element);

  controller.cancel();

  expect(document.body.textContent).toContain('Payment cancelled');
  expect(paymentStorageService.getPayments()).toHaveLength(0);
});
