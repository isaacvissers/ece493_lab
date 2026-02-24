import { createDecisionListView } from '../../src/views/decision_list_view.js';
import { createDecisionDetailView } from '../../src/views/decision_detail_view.js';
import { createDecisionController } from '../../src/controllers/decision_controller.js';
import { decisionRepository } from '../../src/services/decision_repository.js';
import { sessionState } from '../../src/models/session-state.js';
import { authService } from '../../src/services/auth_service.js';
import { auditLogService } from '../../src/services/audit_log_service.js';
import { notificationService } from '../../src/services/notification_service.js';
import { notificationPrefs } from '../../src/services/notification_prefs.js';

beforeEach(() => {
  document.body.innerHTML = '';
  decisionRepository.reset();
  auditLogService.reset();
  notificationService.reset();
  notificationPrefs.reset();
  sessionState.clear();
});

test('AT-UC25-01: author sees decision outcome and notes in submissions', () => {
  decisionRepository.seedPaper({
    paperId: 'paper_25',
    title: 'Paper 25',
    authorIds: ['author_1'],
  });
  decisionRepository.seedDecision({
    decisionId: 'decision_25',
    paperId: 'paper_25',
    value: 'accept',
    notes: 'Great work',
  });
  sessionState.authenticate({ id: 'author_1', email: 'author@example.com' });

  const listView = createDecisionListView();
  const detailView = createDecisionDetailView();
  document.body.append(listView.element, detailView.element);

  const controller = createDecisionController({
    listView,
    detailView,
    decisionRepository,
    sessionState,
    authService,
    auditLogService,
  });
  controller.init();

  const openButton = listView.element.querySelector('button');
  openButton.click();

  expect(detailView.element.textContent).toContain('accept');
  expect(detailView.element.textContent).toContain('Great work');
});

test('AT-UC25-02: delivers notification when enabled', () => {
  notificationPrefs.setPreferences('author_1', { email: true, inApp: false });
  const result = notificationService.sendDecisionNotifications({
    paper: { paperId: 'paper_1' },
    decision: { decisionId: 'decision_1' },
    authors: [{ authorId: 'author_1', email: 'author@example.com' }],
  });

  expect(result.ok).toBe(true);
  const notifications = notificationService.getNotifications();
  expect(notifications).toHaveLength(1);
  expect(notifications[0].channel).toBe('email');
});

test('AT-UC25-03: notification failure logs without blocking access', () => {
  notificationPrefs.setPreferences('author_2', { email: true, inApp: true });
  notificationService.setFailureMode({ email: true, inApp: true });

  const result = notificationService.sendDecisionNotifications({
    paper: { paperId: 'paper_2' },
    decision: { decisionId: 'decision_2' },
    authors: [{ authorId: 'author_2', email: 'author2@example.com' }],
    auditLogService,
  });

  expect(result.ok).toBe(true);
  const logs = auditLogService.getLogs();
  expect(logs.some((log) => log.eventType === 'notification_failed')).toBe(true);
});

test('AT-UC25-04: falls back to in-app when email invalid', () => {
  notificationPrefs.setPreferences('author_3', { email: true, inApp: true });
  const result = notificationService.sendDecisionNotifications({
    paper: { paperId: 'paper_3' },
    decision: { decisionId: 'decision_3' },
    authors: [{ authorId: 'author_3', email: 'invalid-email' }],
    auditLogService,
  });

  expect(result.ok).toBe(true);
  const notifications = notificationService.getNotifications();
  expect(notifications).toHaveLength(1);
  expect(notifications[0].channel).toBe('in_app');
  const logs = auditLogService.getLogs();
  expect(logs.some((log) => log.details.reason === 'invalid_email')).toBe(true);
});

test('AT-UC25-05: unauthenticated author prompted to login and returns', () => {
  decisionRepository.seedPaper({
    paperId: 'paper_auth',
    title: 'Paper Auth',
    authorIds: ['author_auth'],
  });
  decisionRepository.seedDecision({
    decisionId: 'decision_auth',
    paperId: 'paper_auth',
    value: 'reject',
  });

  const detailView = createDecisionDetailView();
  document.body.append(detailView.element);

  let prompted = false;
  const controller = createDecisionController({
    detailView,
    decisionRepository,
    sessionState,
    authService,
    auditLogService,
    onAuthRequired: () => {
      prompted = true;
    },
  });

  controller.showDecision('paper_auth');
  expect(prompted).toBe(true);

  sessionState.authenticate({ id: 'author_auth', email: 'author@example.com' });
  controller.resumePending();
  expect(detailView.element.textContent).toContain('reject');
});

test('AT-UC25-06: non-author access is denied and logged', () => {
  decisionRepository.seedPaper({
    paperId: 'paper_access',
    title: 'Access Paper',
    authorIds: ['author_a'],
  });
  decisionRepository.seedDecision({
    decisionId: 'decision_access',
    paperId: 'paper_access',
    value: 'accept',
  });
  sessionState.authenticate({ id: 'author_b', email: 'other@example.com' });

  const view = createDecisionDetailView();
  document.body.appendChild(view.element);
  const controller = createDecisionController({
    detailView: view,
    decisionRepository,
    sessionState,
    auditLogService,
  });

  controller.showDecision('paper_access');
  expect(view.element.textContent).toContain('Decision not available');
  const logs = auditLogService.getLogs();
  expect(logs.some((log) => log.eventType === 'access_denied')).toBe(true);
});

test('AT-UC25-07: staged release shows pending until release time', () => {
  decisionRepository.seedPaper({
    paperId: 'paper_stage',
    title: 'Staged Paper',
    authorIds: ['author_stage'],
    decisionReleaseAt: new Date(Date.now() + 60000).toISOString(),
  });
  decisionRepository.seedDecision({
    decisionId: 'decision_stage',
    paperId: 'paper_stage',
    value: 'accept',
  });
  sessionState.authenticate({ id: 'author_stage', email: 'author@example.com' });

  const view = createDecisionDetailView();
  document.body.appendChild(view.element);
  const controller = createDecisionController({
    detailView: view,
    decisionRepository,
    sessionState,
  });

  controller.showDecision('paper_stage');
  expect(view.element.textContent).toContain('Pending until');
});

test('AT-UC25-08: decision notes absent are not shown', () => {
  const view = createDecisionDetailView();
  document.body.appendChild(view.element);
  view.setDecision({
    paper: { title: 'Paper' },
    decision: { value: 'accept', notes: null },
  });
  expect(view.element.querySelector('#decision-notes').textContent).toBe('');
});

test('AT-UC25-09: skips notifications when channels disabled', () => {
  notificationPrefs.setPreferences('author_4', { email: false, inApp: false });
  const result = notificationService.sendDecisionNotifications({
    paper: { paperId: 'paper_4' },
    decision: { decisionId: 'decision_4' },
    authors: [{ authorId: 'author_4', email: 'author4@example.com' }],
  });

  expect(result.ok).toBe(true);
  const notifications = notificationService.getNotifications();
  expect(notifications).toHaveLength(0);
});
