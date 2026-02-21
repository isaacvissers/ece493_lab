import { createPaymentFormView } from '../../src/views/payment_form_view.js';
import { createPaymentErrorView } from '../../src/views/payment_error_view.js';
import { createPaymentStatusView } from '../../src/views/payment_status_view.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

test('payment form view handles status, errors, and receipt defaults', () => {
  const view = createPaymentFormView();
  document.body.appendChild(view.element);
  view.setStatus('Ready');
  expect(view.element.textContent).toContain('Ready');
  view.setFieldError('cardNumber', 'Required');
  view.setFieldError('cardholderName', 'Required');
  view.setFieldError('unknown', 'Ignored');
  view.setReceipt();
  expect(view.element.textContent).toContain('Payment receipt');
});

test('payment form view ignores missing receipt nodes', () => {
  const view = createPaymentFormView();
  document.body.appendChild(view.element);
  const referenceNode = view.element.querySelector('#payment-receipt-reference');
  referenceNode.remove();
  view.setReceipt({ reference: 'ref_missing', amount: '10' });
  expect(view.element.textContent).toContain('Payment receipt');
});

test('payment error view falls back to default message', () => {
  const view = createPaymentErrorView();
  document.body.appendChild(view.element);
  view.setMessage('');
  expect(view.element.textContent).toContain('Payment could not be processed');
});

test('payment status view handles defaults and errors', () => {
  const view = createPaymentStatusView();
  document.body.appendChild(view.element);
  view.setStatus('Not found', true);
  view.setStatus('');
  view.setPaymentStatus();
  expect(view.element.textContent).toContain('Payment status');
});

test('payment status view ignores missing status nodes', () => {
  const view = createPaymentStatusView();
  document.body.appendChild(view.element);
  const amountNode = view.element.querySelector('#payment-status-amount');
  amountNode.remove();
  view.setPaymentStatus({ amount: '100' });
  expect(view.element.textContent).toContain('Payment status');
});
