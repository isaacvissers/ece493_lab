import { createPriceListView } from '../../src/views/price_list_view.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

test('price list view includes accessibility attributes', () => {
  const view = createPriceListView();
  document.body.appendChild(view.element);
  const status = view.element.querySelector('#price-list-status');
  const loading = view.element.querySelector('#price-list-loading');
  expect(status.getAttribute('aria-live')).toBe('polite');
  expect(loading.getAttribute('aria-live')).toBe('polite');
});
