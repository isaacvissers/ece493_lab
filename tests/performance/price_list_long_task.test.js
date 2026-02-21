import { createPriceListView } from '../../src/views/price_list_view.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

test('price list render avoids long main-thread tasks', () => {
  const view = createPriceListView();
  document.body.appendChild(view.element);
  const items = [];
  for (let i = 0; i < 8; i += 1) {
    items.push({
      category: 'professional',
      label: `Tier ${i}`,
      rateType: 'Standard',
      displayAmount: '$200.00',
    });
  }
  const start = Date.now();
  view.renderPriceList({ items });
  const elapsed = Date.now() - start;
  expect(elapsed).toBeLessThan(200);
});
