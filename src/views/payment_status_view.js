function createElement(tag, className) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  return element;
}

export function createPaymentStatusView() {
  const container = createElement('section', 'card');
  const title = createElement('h1');
  title.textContent = 'Payment status';

  const status = createElement('div', 'status');
  status.id = 'payment-status';
  status.setAttribute('aria-live', 'polite');

  const list = document.createElement('dl');
  list.className = 'receipt-list';

  const fields = {
    registrationId: { label: 'Registration', value: '' },
    status: { label: 'Status', value: '' },
    amount: { label: 'Amount', value: '' },
    paidAt: { label: 'Paid at', value: '' },
    reference: { label: 'Reference', value: '' },
  };

  Object.entries(fields).forEach(([key, entry]) => {
    const dt = document.createElement('dt');
    dt.textContent = entry.label;
    const dd = document.createElement('dd');
    dd.id = `payment-status-${key}`;
    list.append(dt, dd);
  });

  container.append(title, status, list);

  function setStatus(message, isError = false) {
    status.textContent = message || '';
    status.className = isError ? 'status error' : 'status';
  }

  function setPaymentStatus(data = {}) {
    Object.keys(fields).forEach((key) => {
      const node = container.querySelector(`#payment-status-${key}`);
      if (node) {
        node.textContent = data[key] || '';
      }
    });
  }

  return {
    element: container,
    setStatus,
    setPaymentStatus,
  };
}
