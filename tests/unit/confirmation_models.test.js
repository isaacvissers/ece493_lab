import { createTicketReceipt } from '../../src/models/ticket_receipt.js';
import { createConfirmationRecord } from '../../src/models/confirmation_record.js';
import { createDeliveryLog } from '../../src/models/delivery_log.js';

test('ticket receipt defaults format and issuedAt', () => {
  const receipt = createTicketReceipt();
  expect(receipt.format).toBe('html');
  expect(receipt.conferenceName).toBe('Conference Registration');
  expect(receipt.issuedAt).toBeTruthy();
});

test('confirmation record defaults status and timestamps', () => {
  const record = createConfirmationRecord({ registrationId: 'reg_1' });
  expect(record.status).toBe('pending');
  expect(record.createdAt).toBeTruthy();
  expect(record.updatedAt).toBeTruthy();
});

test('confirmation record uses defaults when called without arguments', () => {
  const record = createConfirmationRecord();
  expect(record.id).toContain('conf_');
  expect(record.status).toBe('pending');
});

test('delivery log defaults status and channel', () => {
  const log = createDeliveryLog({ registrationId: 'reg_1' });
  expect(log.channel).toBe('email');
  expect(log.status).toBe('sent');
  expect(log.lastAttemptAt).toBeTruthy();
});

test('delivery log uses defaults when called without arguments', () => {
  const log = createDeliveryLog();
  expect(log.channel).toBe('email');
  expect(log.status).toBe('sent');
  expect(log.id).toContain('dlog_');
});

test('confirmation record preserves explicit ids and timestamps', () => {
  const record = createConfirmationRecord({
    id: 'conf_custom',
    registrationId: 'reg_2',
    status: 'generated',
    createdAt: '2026-02-21T00:00:00.000Z',
    updatedAt: '2026-02-21T01:00:00.000Z',
  });
  expect(record.id).toBe('conf_custom');
  expect(record.status).toBe('generated');
  expect(record.createdAt).toBe('2026-02-21T00:00:00.000Z');
  expect(record.updatedAt).toBe('2026-02-21T01:00:00.000Z');
});

test('delivery log preserves explicit ids and timestamps', () => {
  const log = createDeliveryLog({
    id: 'dlog_custom',
    registrationId: 'reg_3',
    channel: 'in_app',
    status: 'failed',
    lastAttemptAt: '2026-02-21T02:00:00.000Z',
  });
  expect(log.id).toBe('dlog_custom');
  expect(log.channel).toBe('in_app');
  expect(log.status).toBe('failed');
  expect(log.lastAttemptAt).toBe('2026-02-21T02:00:00.000Z');
});
