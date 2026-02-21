import { sessionState } from '../../src/models/session-state.js';
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
  document.body.innerHTML = '';
});

test('persistence failure shows pending confirmation message', () => {
  sessionState.authenticate({ id: 'acct_attendee', email: 'attendee@example.com' });
  const paymentService = {
    submitCardPayment: () => ({ ok: false, reason: 'persistence_failure', payment: { id: 'pay_1' } }),
  };
  const view = createPaymentFormView();
  const errorView = createPaymentErrorView();
  const controller = createPaymentController({ view, errorView, paymentService });
  controller.init();
  controller.show({ registrationId: 'reg_persist', amount: 99, currency: 'USD' });
  document.body.appendChild(view.element);

  fillForm(view);
  controller.submit({ preventDefault: () => {} });
  document.body.innerHTML = '';
  document.body.appendChild(controller.view.element);

  expect(document.body.textContent).toContain('confirmation could not be saved');
});
