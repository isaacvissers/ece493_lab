import { sessionState } from '../../src/models/session-state.js';
import { paymentService } from '../../src/services/payment_service.js';
import { paymentStorageService } from '../../src/services/payment_storage_service.js';
import { createPaymentFormView } from '../../src/views/payment_form_view.js';
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
  paymentStorageService.reset();
  document.body.innerHTML = '';
});

test('zero amount bypasses payment and confirms registration', () => {
  sessionState.authenticate({ id: 'acct_attendee', email: 'attendee@example.com' });
  const view = createPaymentFormView();
  const controller = createPaymentController({ view });
  controller.init();
  controller.show({ registrationId: 'reg_zero', amount: 0, currency: 'USD' });
  document.body.appendChild(view.element);

  fillForm(view);
  controller.submit({ preventDefault: () => {} });

  const payment = paymentStorageService.getPaymentByRegistration('reg_zero');
  const balance = paymentStorageService.getBalance('reg_zero');
  expect(payment.status).toBe('captured');
  expect(balance.status).toBe('confirmed');
  expect(document.body.textContent).toContain('Payment receipt');
});
