function createElement(tag, className) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  return element;
}

export function createConfirmationView() {
  const container = createElement('section', 'card');
  const title = createElement('h1');
  title.textContent = 'Payment confirmation';

  const status = createElement('div', 'status');
  status.id = 'confirmation-status';
  status.setAttribute('aria-live', 'polite');

  const list = document.createElement('dl');
  list.className = 'receipt-list';

  const fields = {
    conferenceName: { label: 'Conference', value: '' },
    attendeeName: { label: 'Attendee', value: '' },
    ticketType: { label: 'Ticket type', value: '' },
    amountPaid: { label: 'Amount paid', value: '' },
    transactionReference: { label: 'Transaction', value: '' },
    issuedAt: { label: 'Issued at', value: '' },
  };

  Object.entries(fields).forEach(([key, entry]) => {
    const dt = document.createElement('dt');
    dt.textContent = entry.label;
    const dd = document.createElement('dd');
    dd.id = `confirmation-${key}`;
    list.append(dt, dd);
  });

  container.append(title, status, list);

  function setStatus(message, isError = false) {
    status.textContent = message || '';
    status.className = isError ? 'status error' : 'status';
  }

  function setConfirmation(receipt = {}) {
    Object.keys(fields).forEach((key) => {
      const node = container.querySelector(`#confirmation-${key}`);
      if (node) {
        node.textContent = receipt[key] || '';
      }
    });
  }

  return {
    element: container,
    setStatus,
    setConfirmation,
  };
}
