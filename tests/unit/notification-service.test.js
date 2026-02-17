import { notificationService } from '../../src/services/notification-service.js';

beforeEach(() => {
  notificationService.clear();
});

test('sends notifications successfully', () => {
  const result = notificationService.sendNotifications('paper_1', [
    'a@example.com',
    'b@example.com',
    'c@example.com',
  ]);
  expect(result.ok).toBe(true);
  expect(notificationService.getLog()).toHaveLength(3);
});

test('retries failed notifications once within 5 minutes', () => {
  notificationService.setFailureMode(true);
  const result = notificationService.sendNotifications('paper_2', ['a@example.com']);
  expect(result.ok).toBe(true);
  const log = notificationService.getLog();
  expect(log).toHaveLength(2);
  const first = new Date(log[0].attemptedAt);
  const second = new Date(log[1].attemptedAt);
  expect(second - first).toBe(5 * 60 * 1000);
});

test('reports failure when retry also fails', () => {
  notificationService.setFailureMode(true);
  notificationService.setRetryFailureMode(true);
  const result = notificationService.sendNotifications('paper_3', ['a@example.com']);
  expect(result.ok).toBe(false);
  expect(result.failures).toEqual(['a@example.com']);
  const log = notificationService.getLog();
  expect(log).toHaveLength(2);
  expect(log[0].status).toBe('failed');
  expect(log[1].status).toBe('failed');
});
