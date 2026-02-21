import { createPaymentFormView } from '../../src/views/payment_form_view.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

test('payment form view renders input rows with default options', () => {
  const view = createPaymentFormView();
  document.body.appendChild(view.element);
  const cardholder = view.element.querySelector('#cardholderName');
  expect(cardholder.autocomplete).toBe('cc-name');
  const cancelButton = view.element.querySelector('#payment-cancel');
  cancelButton.click();
});
