import { authorNotificationService } from '../../src/services/authorNotificationService.js';

beforeEach(() => {
  authorNotificationService.reset();
});

test('records decision notifications', () => {
  const result = authorNotificationService.notifyDecision({ paperId: 'paper_1', decisionId: 'decision_1' });
  expect(result.ok).toBe(true);
  const entries = authorNotificationService.getNotifications();
  expect(entries).toHaveLength(1);
  expect(entries[0].reviewId).toBe('decision_1');
});

test('reports failure when notification mode is disabled', () => {
  authorNotificationService.setFailureMode(true);
  const result = authorNotificationService.notifyDecision({ paperId: 'paper_2', decisionId: 'decision_2' });
  expect(result.ok).toBe(false);
  expect(authorNotificationService.getNotifications()).toHaveLength(0);
  authorNotificationService.setFailureMode(false);
});

test('reset clears notifications', () => {
  authorNotificationService.notifyDecision({ paperId: 'paper_3', decisionId: 'decision_3' });
  authorNotificationService.reset();
  expect(authorNotificationService.getNotifications()).toHaveLength(0);
});

test('reuses cached notifications list', () => {
  const first = authorNotificationService.getNotifications();
  expect(first).toEqual([]);
  authorNotificationService.notifyDecision({ paperId: 'paper_4', decisionId: 'decision_4' });
  const second = authorNotificationService.getNotifications();
  expect(second).toHaveLength(1);
});

test('loads notifications from localStorage when present', () => {
  localStorage.setItem('cms.decision_notifications', JSON.stringify([
    { notificationId: 'note_1', reviewId: 'decision_5', status: 'sent' },
  ]));
  const notifications = authorNotificationService.getNotifications();
  expect(notifications).toHaveLength(1);
});

test('notifyDecision tolerates missing input', () => {
  const result = authorNotificationService.notifyDecision();
  expect(result.ok).toBe(true);
});
