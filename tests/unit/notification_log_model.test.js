import { createNotificationLog } from '../../src/models/notification_log.js';

test('creates notification log with defaults', () => {
  const log = createNotificationLog({ scheduleId: 'sched_1' });
  expect(log.notificationId).toContain('notif_');
  expect(log.status).toBe('pending');
});

test('respects provided notificationId and status', () => {
  const log = createNotificationLog({ notificationId: 'notif_custom', scheduleId: 'sched_2', status: 'sent' });
  expect(log.notificationId).toBe('notif_custom');
  expect(log.status).toBe('sent');
});

test('uses provided createdAt timestamp', () => {
  const log = createNotificationLog({ scheduleId: 'sched_3', createdAt: '2026-05-01T00:00:00.000Z' });
  expect(log.createdAt).toBe('2026-05-01T00:00:00.000Z');
});

test('creates notification log with no args', () => {
  const log = createNotificationLog();
  expect(log.notificationId).toContain('notif_');
});
