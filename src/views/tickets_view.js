function createElement(tag, className) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  return element;
}

export function createTicketsView() {
  const container = createElement('section', 'card');
  const title = createElement('h1');
  title.textContent = 'My tickets';

  const status = createElement('div', 'status');
  status.id = 'tickets-status';
  status.setAttribute('aria-live', 'polite');

  const list = createElement('div', 'ticket-list');

  container.append(title, status, list);

  function setStatus(message, isError = false) {
    status.textContent = message || '';
    status.className = isError ? 'status error' : 'status';
  }

  function renderTicket(receipt) {
    const card = createElement('section', 'card ticket');
    const heading = createElement('h2');
    heading.textContent = receipt.conferenceName || 'Conference';
    const details = document.createElement('dl');
    details.className = 'receipt-list';
    const fields = {
      attendeeName: 'Attendee',
      ticketType: 'Ticket type',
      amountPaid: 'Amount paid',
      transactionReference: 'Transaction',
      issuedAt: 'Issued at',
    };
    Object.entries(fields).forEach(([key, label]) => {
      const dt = document.createElement('dt');
      dt.textContent = label;
      const dd = document.createElement('dd');
      dd.textContent = receipt[key] || '';
      details.append(dt, dd);
    });
    card.append(heading, details);
    return card;
  }

  function setTickets(receipts = []) {
    list.innerHTML = '';
    if (!receipts.length) {
      const empty = createElement('p', 'helper');
      empty.textContent = 'No tickets available yet.';
      list.appendChild(empty);
      return;
    }
    receipts.forEach((receipt) => {
      list.appendChild(renderTicket(receipt));
    });
  }

  return {
    element: container,
    setStatus,
    setTickets,
  };
}
