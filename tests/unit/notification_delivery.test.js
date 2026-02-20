import { jest } from '@jest/globals';
import { notificationService } from '../../src/services/notification_service.js';
import { auditLogService } from '../../src/services/audit_log_service.js';

beforeEach(() => {
  notificationService.reset();
  auditLogService.reset();
});

test('sendFinalScheduleNotifications returns schedule_not_published when missing publish status', () => {
  const result = notificationService.sendFinalScheduleNotifications({ schedule: { status: 'draft' }, papers: [] });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('schedule_not_published');
});

test('sendFinalScheduleNotifications returns schedule_not_published when schedule missing', () => {
  const result = notificationService.sendFinalScheduleNotifications({ schedule: null, papers: [] });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('schedule_not_published');
});

test('sendFinalScheduleNotifications returns schedule_not_published when called without args', () => {
  const result = notificationService.sendFinalScheduleNotifications();
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('schedule_not_published');
});

test('sendFinalScheduleNotifications handles non-array paper input', () => {
  const result = notificationService.sendFinalScheduleNotifications({
    schedule: { scheduleId: 'sched_empty', status: 'published' },
    papers: 'not-an-array',
  });
  expect(result.ok).toBe(true);
  expect(result.results).toEqual([]);
});

test('sendFinalScheduleNotifications delivers email and in-app notifications', () => {
  const result = notificationService.sendFinalScheduleNotifications({
    schedule: { scheduleId: 'sched_1', status: 'published' },
    papers: [
      {
        paperId: 'paper_1',
        authorIds: ['author_1'],
        authorEmailMap: { author_1: 'author1@example.com' },
      },
    ],
  });
  expect(result.ok).toBe(true);
  const notifications = notificationService.getNotifications();
  const channels = notifications.map((note) => note.channel).sort();
  expect(channels).toEqual(['email', 'in_app']);
});

test('sendFinalScheduleNotifications logs invalid email failures', () => {
  const auditLogStub = { log: jest.fn() };
  const result = notificationService.sendFinalScheduleNotifications({
    schedule: { scheduleId: 'sched_invalid', status: 'published' },
    papers: [
      {
        id: 'paper_invalid',
        authorIds: ['author_invalid'],
        email: 'invalid-email',
      },
    ],
    auditLogService: auditLogStub,
  });
  expect(result.ok).toBe(false);
  expect(auditLogStub.log).toHaveBeenCalled();
  const notifications = notificationService.getNotifications();
  expect(notifications[0].reason).toBe('invalid_email');
});

test('sendFinalScheduleNotifications logs failures but still returns results', () => {
  notificationService.setFailureMode({ email: true, inApp: true });
  const result = notificationService.sendFinalScheduleNotifications({
    schedule: { scheduleId: 'sched_fail', status: 'published' },
    papers: [
      {
        paperId: 'paper_fail',
        authorIds: ['author_fail'],
        authorEmailMap: { author_fail: 'author_fail@example.com' },
      },
    ],
    auditLogService,
  });
  expect(result.ok).toBe(false);
  const logs = auditLogService.getLogs();
  expect(logs.some((log) => log.eventType === 'schedule_notification_failed')).toBe(true);
});

test('sendFinalScheduleNotifications handles failures without audit logging', () => {
  notificationService.setFailureMode({ email: true, inApp: true });
  const result = notificationService.sendFinalScheduleNotifications({
    schedule: { scheduleId: 'sched_no_log', status: 'published' },
    papers: [
      {
        paperId: 'paper_no_log',
        authorIds: ['author_no_log'],
        authorEmailMap: { author_no_log: 'author_no_log@example.com' },
      },
    ],
  });
  expect(result.ok).toBe(false);
  expect(result.results.length).toBe(2);
});

test('sendFinalScheduleNotifications logs failures using provided audit logger', () => {
  notificationService.setFailureMode({ email: true, inApp: true });
  const auditLogStub = { log: jest.fn() };
  const result = notificationService.sendFinalScheduleNotifications({
    schedule: { scheduleId: 'sched_fail_stub', status: 'published' },
    papers: [
      {
        paperId: 'paper_fail_stub',
        authorIds: ['author_fail_stub'],
        authorEmailMap: { author_fail_stub: 'author_fail_stub@example.com' },
      },
    ],
    auditLogService: auditLogStub,
  });
  expect(result.ok).toBe(false);
  expect(auditLogStub.log).toHaveBeenCalled();
});

test('sendFinalScheduleNotifications logs both channel failures with schedule id', () => {
  notificationService.setFailureMode({ email: true, inApp: true });
  const auditLogStub = { log: jest.fn() };
  notificationService.sendFinalScheduleNotifications({
    schedule: { scheduleId: 'sched_channels', status: 'published' },
    papers: [
      {
        paperId: 'paper_channels',
        authorIds: ['author_channels'],
        authorEmailMap: { author_channels: 'author_channels@example.com' },
      },
    ],
    auditLogService: auditLogStub,
  });
  expect(auditLogStub.log.mock.calls.length).toBeGreaterThanOrEqual(2);
});

test('sendFinalScheduleNotifications falls back to schedule relatedId when missing ids', () => {
  notificationService.setFailureMode({ email: true, inApp: true });
  const auditLogStub = { log: jest.fn() };
  notificationService.sendFinalScheduleNotifications({
    schedule: { status: 'published' },
    papers: [
      {
        paperId: 'paper_fallback',
        authorIds: ['author_fallback'],
        authorEmailMap: { author_fallback: 'author_fallback@example.com' },
      },
    ],
    auditLogService: auditLogStub,
  });
  const relatedIds = auditLogStub.log.mock.calls.map((call) => call[0].relatedId);
  expect(relatedIds).toContain('schedule');
});

test('sendFinalScheduleNotifications logs in-app failures with audit logging', () => {
  notificationService.setFailureMode({ email: false, inApp: true });
  const auditLogStub = { log: jest.fn() };
  const result = notificationService.sendFinalScheduleNotifications({
    schedule: { conferenceId: 'conf_inapp', status: 'published' },
    papers: [
      {
        paperId: 'paper_inapp',
        authorIds: ['author_inapp'],
        authorEmailMap: { author_inapp: 'author_inapp@example.com' },
      },
    ],
    auditLogService: auditLogStub,
  });
  expect(result.ok).toBe(false);
  expect(auditLogStub.log).toHaveBeenCalled();
});

test('sendFinalScheduleNotifications logs email failures with audit logging', () => {
  notificationService.setFailureMode({ email: true, inApp: false });
  const auditLogStub = { log: jest.fn() };
  const result = notificationService.sendFinalScheduleNotifications({
    schedule: { conferenceId: 'conf_email', status: 'published' },
    papers: [
      {
        paperId: 'paper_email',
        authorIds: ['author_email'],
        authorEmailMap: { author_email: 'author_email@example.com' },
      },
    ],
    auditLogService: auditLogStub,
  });
  expect(result.ok).toBe(false);
  expect(auditLogStub.log).toHaveBeenCalled();
});
