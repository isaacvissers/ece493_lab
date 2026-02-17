import { createNotificationLogEntry } from '../../src/models/notification-log.js';

test('creates notification log entry with defaults', () => {
  const entry = createNotificationLogEntry({
    paperId: 'paper_1',
    refereeEmail: 'ref@example.com',
    status: 'sent',
  });
  expect(entry.paperId).toBe('paper_1');
  expect(entry.refereeEmail).toBe('ref@example.com');
  expect(entry.status).toBe('sent');
  expect(entry.attemptedAt).toContain('T');
});

test('creates notification log entry with error message', () => {
  const entry = createNotificationLogEntry({
    paperId: 'paper_2',
    refereeEmail: 'fail@example.com',
    status: 'failed',
    errorMessage: 'send_failed',
    attemptedAt: '2026-02-02T10:00:00.000Z',
  });
  expect(entry.errorMessage).toBe('send_failed');
  expect(entry.attemptedAt).toBe('2026-02-02T10:00:00.000Z');
});
