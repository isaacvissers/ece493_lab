import { createRegistrationOrder } from '../../src/models/registration_order.js';

test('registration order defaults status and timestamps', () => {
  const order = createRegistrationOrder({ order_id: 'ord_1', attendee_ref: 'att_1' });
  expect(order.order_id).toBe('ord_1');
  expect(order.status).toBe('pending');
  expect(order.paid_at).toBe(null);
});

test('registration order generates defaults', () => {
  const order = createRegistrationOrder();
  expect(order.order_id).toContain('ord_');
  expect(order.currency).toBe('USD');
});

test('registration order preserves explicit values', () => {
  const order = createRegistrationOrder({
    order_id: 'ord_2',
    attendee_ref: 'att_2',
    status: 'paid_confirmed',
    paid_at: '2026-02-20T00:00:00.000Z',
    amount: 100,
    currency: 'USD',
  });
  expect(order.status).toBe('paid_confirmed');
  expect(order.paid_at).toBe('2026-02-20T00:00:00.000Z');
  expect(order.amount).toBe(100);
});
