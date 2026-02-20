import { notificationService } from '../../src/services/notification_service.js';
import { notificationPrefs } from '../../src/services/notification_prefs.js';
import { auditLogService } from '../../src/services/audit_log_service.js';

beforeEach(() => {
  notificationService.reset();
  notificationPrefs.reset();
  auditLogService.reset();
});

test('returns error when payload missing', () => {
  const result = notificationService.sendDecisionNotifications();
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('missing_payload');
});

test('handles in-app failure mode', () => {
  notificationPrefs.setPreferences('author_5', { email: false, inApp: true });
  notificationService.setFailureMode({ inApp: true });

  const result = notificationService.sendDecisionNotifications({
    paper: { paperId: 'paper_5' },
    decision: { decisionId: 'decision_5' },
    authors: [{ authorId: 'author_5', email: 'author5@example.com' }],
    auditLogService,
  });

  expect(result.ok).toBe(true);
  const notifications = notificationService.getNotifications();
  expect(notifications[0].status).toBe('failed');
});

test('records sent notifications for multiple authors', () => {
  notificationPrefs.setPreferences('author_6', { email: true, inApp: false });
  notificationPrefs.setPreferences('author_7', { email: false, inApp: true });

  const result = notificationService.sendDecisionNotifications({
    paper: { paperId: 'paper_6' },
    decision: { decisionId: 'decision_6' },
    authors: [
      { authorId: 'author_6', email: 'author6@example.com' },
      { authorId: 'author_7', email: 'author7@example.com' },
    ],
  });

  expect(result.ok).toBe(true);
  expect(notificationService.getNotifications()).toHaveLength(2);
});

test('records schedule notifications on success', () => {
  const result = notificationService.triggerScheduleNotifications({
    schedule: { scheduleId: 'sched_1' },
    entry: { entryId: 'entry_1' },
  });
  expect(result.ok).toBe(true);
  const logs = notificationService.getScheduleNotifications();
  expect(logs[0].status).toBe('sent');
});

test('returns error when schedule notification payload missing', () => {
  const result = notificationService.triggerScheduleNotifications();
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('missing_payload');
});

test('records schedule notification failure when delivery fails', () => {
  notificationService.setFailureMode({ email: true });
  const result = notificationService.triggerScheduleNotifications({
    schedule: { scheduleId: 'sched_2' },
    entry: { entryId: 'entry_2' },
  });
  expect(result.ok).toBe(false);
  const logs = notificationService.getScheduleNotifications();
  expect(logs[0].status).toBe('failed');
});

test('uses itemId when entryId missing in schedule notifications', () => {
  notificationService.reset();
  const result = notificationService.triggerScheduleNotifications({
    schedule: { scheduleId: 'sched_3' },
    entry: { itemId: 'item_3' },
  });
  expect(result.ok).toBe(true);
  const logs = notificationService.getScheduleNotifications();
  expect(logs[0].details.entryId).toBe('item_3');
});

test('records failed notifications with itemId fallback', () => {
  notificationService.setFailureMode({ inApp: true });
  const result = notificationService.triggerScheduleNotifications({
    schedule: { scheduleId: 'sched_4' },
    entry: { itemId: 'item_4' },
  });
  expect(result.ok).toBe(false);
  const logs = notificationService.getScheduleNotifications();
  expect(logs[0].details.entryId).toBe('item_4');
});
