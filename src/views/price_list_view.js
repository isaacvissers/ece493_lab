function createElement(tag, className) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  return element;
}

function clearNode(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

function formatCategory(value) {
  if (!value) {
    return 'Unspecified';
  }
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => `${part[0].toUpperCase()}${part.slice(1)}`)
    .join(' ');
}

export function createPriceListView() {
  const container = createElement('section', 'card');
  const title = createElement('h1');
  title.textContent = 'Price list';

  const updated = createElement('p', 'helper');
  updated.id = 'price-list-updated';

  const status = createElement('div', 'status');
  status.id = 'price-list-status';
  status.setAttribute('aria-live', 'polite');

  const loading = createElement('div', 'loading');
  loading.id = 'price-list-loading';
  loading.textContent = 'Loading price list...';
  loading.setAttribute('aria-live', 'polite');
  loading.hidden = true;

  const content = createElement('div', 'price-list-content');
  content.id = 'price-list-content';

  container.append(title, updated, status, loading, content);

  function setStatus(message, isError = false) {
    status.textContent = message || '';
    status.className = isError ? 'status error' : 'status';
  }

  function setLoading(isLoading) {
    loading.hidden = !isLoading;
  }

  function setLastUpdated(value) {
    updated.textContent = value ? `Last updated: ${value}` : '';
  }

  function setNotAvailable(message = 'Price list not available yet.') {
    setStatus(message, false);
    setLoading(false);
    setLastUpdated('');
    clearNode(content);
    const empty = createElement('p', 'helper');
    empty.textContent = message;
    content.appendChild(empty);
  }

  function setAccessRestricted(message = 'Please log in to view pricing.') {
    setStatus(message, true);
    setLoading(false);
    setLastUpdated('');
    clearNode(content);
    const helper = createElement('p', 'helper');
    helper.textContent = message;
    content.appendChild(helper);
  }

  function setTimeout(message = 'Pricing is taking longer than expected. Please try again.') {
    setStatus(message, true);
    setLoading(false);
  }

  function renderPriceList({ items = [], lastUpdatedAt = '' } = {}) {
    setStatus('', false);
    setLastUpdated(lastUpdatedAt);
    clearNode(content);

    if (!items.length) {
      const empty = createElement('p', 'helper');
      empty.textContent = 'No pricing details available.';
      content.appendChild(empty);
      return;
    }

    const table = document.createElement('table');
    table.className = 'price-list-table';
    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');
    ['Category/Label', 'Rate type', 'Amount'].forEach((label) => {
      const th = document.createElement('th');
      th.scope = 'col';
      th.textContent = label;
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    const tbody = document.createElement('tbody');

    items.forEach((item) => {
      const row = document.createElement('tr');
      const categoryCell = document.createElement('td');
      const categoryText = item.label
        ? `${formatCategory(item.category)} - ${item.label}`
        : formatCategory(item.category);
      categoryCell.textContent = categoryText;
      const rateCell = document.createElement('td');
      rateCell.textContent = item.rateType || 'Standard';
      const amountCell = document.createElement('td');
      amountCell.className = 'price-list-amount';
      amountCell.textContent = item.displayAmount || 'TBD';
      row.append(categoryCell, rateCell, amountCell);
      tbody.appendChild(row);
    });

    table.append(thead, tbody);
    content.appendChild(table);
  }

  return {
    element: container,
    setStatus,
    setLoading,
    setNotAvailable,
    setAccessRestricted,
    setTimeout,
    renderPriceList,
  };
}
