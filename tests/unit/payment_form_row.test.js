import { createInputRow } from '../../src/views/payment_form_view.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

test('payment input row defaults to text without autocomplete', () => {
  const row = createInputRow({ id: 'custom', label: 'Custom' });
  document.body.appendChild(row.row);
  expect(row.input.type).toBe('text');
  expect(row.input.autocomplete).toBe('');
});

test('payment input row applies autocomplete when provided', () => {
  const row = createInputRow({ id: 'number', label: 'Number', autocomplete: 'cc-number' });
  document.body.appendChild(row.row);
  expect(row.input.autocomplete).toBe('cc-number');
});

test('payment input row handles default args', () => {
  const row = createInputRow();
  document.body.appendChild(row.row);
  expect(row.input.type).toBe('text');
  expect(row.error.id).toContain('undefined-error');
});
