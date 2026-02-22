import { createConfirmationView } from '../../src/views/confirmation_view.js';
import { createConfirmationErrorView } from '../../src/views/confirmation_error_view.js';
import { createTicketsView } from '../../src/views/tickets_view.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

test('confirmation view renders receipt details', () => {
  const view = createConfirmationView();
  document.body.appendChild(view.element);
  view.setStatus('Ready');
  view.setConfirmation({
    conferenceName: 'Conf',
    attendeeName: 'Ada',
    ticketType: 'Virtual',
    amountPaid: '50',
    transactionReference: 'ref_1',
    issuedAt: '2026-02-20',
  });
  expect(view.element.textContent).toContain('Payment confirmation');
  expect(view.element.textContent).toContain('Ada');
});

test('confirmation view handles empty status and default confirmation', () => {
  const view = createConfirmationView();
  document.body.appendChild(view.element);
  view.setStatus('');
  const missingNode = view.element.querySelector('#confirmation-attendeeName');
  if (missingNode) {
    missingNode.remove();
  }
  view.setConfirmation();
  const status = view.element.querySelector('#confirmation-status');
  expect(status.textContent).toBe('');
});

test('confirmation error view falls back to default message', () => {
  const view = createConfirmationErrorView();
  document.body.appendChild(view.element);
  view.setMessage('');
  expect(view.element.textContent).toContain('Confirmation is pending');
});

test('tickets view renders empty and populated states', () => {
  const view = createTicketsView();
  document.body.appendChild(view.element);
  view.setTickets([]);
  expect(view.element.textContent).toContain('No tickets available');
  view.setTickets([{
    conferenceName: 'Conf',
    attendeeName: 'Ada',
    ticketType: 'In-person',
    amountPaid: '100',
    transactionReference: 'ref',
    issuedAt: '2026-02-20',
  }]);
  expect(view.element.textContent).toContain('Ada');
});

test('tickets view uses defaults for missing values', () => {
  const view = createTicketsView();
  document.body.appendChild(view.element);
  view.setStatus('');
  view.setStatus('Problem', true);
  view.setTickets();
  expect(view.element.textContent).toContain('No tickets available');
  view.setTickets([{}]);
  expect(view.element.textContent).toContain('Conference');
});
