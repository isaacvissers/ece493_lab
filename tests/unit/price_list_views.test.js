import { createPriceListView } from '../../src/views/price_list_view.js';
import { createPriceListErrorView } from '../../src/views/price_list_error_view.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

test('price list view renders table and handles empty state', () => {
  const view = createPriceListView();
  document.body.appendChild(view.element);

  view.renderPriceList({ items: [] });
  expect(view.element.textContent).toContain('No pricing details available.');

  view.renderPriceList({
    items: [
      {
        category: 'early-bird',
        label: 'Starter',
        rateType: 'Early',
        displayAmount: '$50.00',
      },
    ],
  });

  const table = view.element.querySelector('table');
  expect(table).toBeTruthy();
  expect(view.element.textContent).toContain('Early Bird - Starter');
  expect(view.element.textContent).toContain('$50.00');
});

test('price list view handles status helpers', () => {
  const view = createPriceListView();
  document.body.appendChild(view.element);
  view.setStatus('Updated');
  expect(view.element.textContent).toContain('Updated');
  view.setNotAvailable();
  expect(view.element.textContent).toContain('Price list not available yet');
  view.setAccessRestricted();
  expect(view.element.textContent).toContain('Please log in');
  view.setTimeout();
  expect(view.element.textContent).toContain('taking longer');
});

test('price list view handles defaults and missing fields', () => {
  const view = createPriceListView();
  document.body.appendChild(view.element);

  view.renderPriceList();
  expect(view.element.textContent).toContain('No pricing details available.');

  view.renderPriceList({
    items: [
      {
        category: '',
        label: '',
        rateType: '',
        displayAmount: '',
      },
    ],
  });

  const rows = view.element.querySelectorAll('tbody tr');
  expect(rows).toHaveLength(1);
  expect(rows[0].textContent).toContain('Unspecified');
  expect(rows[0].textContent).toContain('Standard');
  expect(rows[0].textContent).toContain('TBD');
});

test('price list error view displays fallback message', () => {
  const view = createPriceListErrorView();
  document.body.appendChild(view.element);
  view.setMessage('Custom error');
  expect(view.element.textContent).toContain('Custom error');
  view.setMessage('');
  expect(view.element.textContent).toContain('Pricing cannot be displayed right now');
});
