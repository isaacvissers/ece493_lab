function createElement(tag, className) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  return element;
}

export function createRegistrationStatusView() {
  const container = createElement('section', 'card');
  const title = createElement('h2');
  title.textContent = 'Registration receipt';

  const status = createElement('div', 'status');
  status.id = 'registration-receipt-status';
  status.setAttribute('aria-live', 'polite');

  const list = document.createElement('dl');
  list.className = 'receipt-list';

  const fields = {
    name: { label: 'Name', value: '' },
    affiliation: { label: 'Affiliation', value: '' },
    attendanceType: { label: 'Attendance', value: '' },
    registrationStatus: { label: 'Registration status', value: '' },
    paymentStatus: { label: 'Payment status', value: '' },
  };

  Object.entries(fields).forEach(([key, entry]) => {
    const dt = document.createElement('dt');
    dt.textContent = entry.label;
    const dd = document.createElement('dd');
    dd.id = `registration-receipt-${key}`;
    list.append(dt, dd);
  });

  const retryButton = document.createElement('button');
  retryButton.type = 'button';
  retryButton.className = 'button secondary';
  retryButton.id = 'registration-retry-payment';
  retryButton.textContent = 'Retry payment';
  retryButton.hidden = true;

  container.append(title, status, list, retryButton);

  function setStatus(message, isError = false) {
    status.textContent = message || '';
    status.className = isError ? 'status error' : 'status';
  }

  function setReceipt(receipt = {}) {
    Object.keys(fields).forEach((key) => {
      const node = container.querySelector(`#registration-receipt-${key}`);
      if (node) {
        node.textContent = receipt[key] || '';
      }
    });
  }

  function setRetryVisible(visible) {
    retryButton.hidden = !visible;
  }

  return {
    element: container,
    setStatus,
    setReceipt,
    setRetryVisible,
    onRetryPayment(handler) {
      retryButton.addEventListener('click', handler);
    },
  };
}
