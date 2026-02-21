import { sessionState } from '../../src/models/session-state.js';
import { paymentService } from '../../src/services/payment_service.js';
import { paymentGatewayService } from '../../src/services/payment_gateway_service.js';
import { paymentStorageService } from '../../src/services/payment_storage_service.js';
import { createPaymentFormView } from '../../src/views/payment_form_view.js';
import { createPaymentErrorView } from '../../src/views/payment_error_view.js';
import { createPaymentController } from '../../src/controllers/payment_controller.js';

function fillForm(view) {
  view.element.querySelector('#cardholderName').value = 'Ada Lovelace';
  view.element.querySelector('#cardNumber').value = '4242424242424242';
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

test('gateway error shows temporary failure message', () => {
  sessionState.authenticate({ id: 'acct_attendee', email: 'attendee@example.com' });
  paymentGatewayService.setNextResult('error');

  const view = createPaymentFormView();
  const errorView = createPaymentErrorView();
  const controller = createPaymentController({ view, errorView });
  controller.init();
  controller.show({ registrationId: 'reg_error', amount: 80, currency: 'USD' });
  document.body.appendChild(view.element);

  fillForm(view);
  controller.submit({ preventDefault: () => {} });
  document.body.innerHTML = '';
  document.body.appendChild(controller.view.element);

  expect(document.body.textContent).toContain('Payment could not be processed');
});
