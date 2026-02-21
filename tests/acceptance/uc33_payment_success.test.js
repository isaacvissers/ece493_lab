import { sessionState } from '../../src/models/session-state.js';
import { paymentService } from '../../src/services/payment_service.js';
import { paymentGatewayService } from '../../src/services/payment_gateway_service.js';
import { paymentStorageService } from '../../src/services/payment_storage_service.js';
import { paymentNotificationService } from '../../src/services/payment_notification_service.js';
import { createPaymentFormView } from '../../src/views/payment_form_view.js';
import { createPaymentController } from '../../src/controllers/payment_controller.js';

function fillForm(view) {
  view.element.querySelector('#cardholderName').value = 'Ada Lovelace';
  view.element.querySelector('#cardNumber').value = '4242424242424242';
  view.element.querySelector('#expiryMonth').value = '12';
  view.element.querySelector('#expiryYear').value = '2030';
  view.element.querySelector('#cvv').value = '123';
  view.element.querySelector('#billingPostal').value = '12345';
}

beforeEach(() => {
  sessionState.clear();
  paymentService.reset();
  paymentGatewayService.reset();
  paymentStorageService.reset();
  paymentNotificationService.reset();
  document.body.innerHTML = '';
});

test('authenticated attendee can complete credit card payment', () => {
  sessionState.authenticate({ id: 'acct_attendee', email: 'attendee@example.com' });
  const view = createPaymentFormView();
  const controller = createPaymentController({ view });
  controller.init();
  controller.show({ registrationId: 'reg_33', amount: 125, currency: 'USD' });
  document.body.appendChild(view.element);

  fillForm(view);
  controller.submit({ preventDefault: () => {} });

  expect(document.body.textContent).toContain('Payment receipt');
  expect(document.body.textContent).toContain('Payment confirmed');
  const stored = paymentStorageService.getPaymentByRegistration('reg_33');
  expect(stored.status).toBe('captured');
});
