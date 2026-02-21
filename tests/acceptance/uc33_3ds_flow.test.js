import { sessionState } from '../../src/models/session-state.js';
import { paymentService } from '../../src/services/payment_service.js';
import { paymentGatewayService } from '../../src/services/payment_gateway_service.js';
import { paymentStorageService } from '../../src/services/payment_storage_service.js';
import { createPaymentFormView } from '../../src/views/payment_form_view.js';
import { createPaymentController } from '../../src/controllers/payment_controller.js';

function fillForm(view) {
  view.element.querySelector('#cardholderName').value = 'Ada Lovelace';
  view.element.querySelector('#cardNumber').value = '4000000000003220';
  view.element.querySelector('#expiryMonth').value = '11';
  view.element.querySelector('#expiryYear').value = '2030';
  view.element.querySelector('#cvv').value = '123';
  view.element.querySelector('#billingPostal').value = '12345';
}

beforeEach(() => {
  sessionState.clear();
  paymentService.reset();
  paymentGatewayService.reset();
  paymentStorageService.reset();
  document.body.innerHTML = '';
});

test('3-D Secure required flow can complete after authentication', () => {
  sessionState.authenticate({ id: 'acct_attendee', email: 'attendee@example.com' });
  paymentGatewayService.setNextResult('requires_authentication');

  const view = createPaymentFormView();
  const controller = createPaymentController({ view });
  controller.init();
  controller.show({ registrationId: 'reg_3ds', amount: 100, currency: 'USD' });
  document.body.appendChild(view.element);

  fillForm(view);
  controller.submit({ preventDefault: () => {} });
  expect(document.body.textContent).toContain('Additional authentication required');

  controller.completeAuthentication(true);
  expect(document.body.textContent).toContain('Payment receipt');
  const stored = paymentStorageService.getPaymentByRegistration('reg_3ds');
  expect(stored.status).toBe('captured');
});
