import { jest } from '@jest/globals';
import { createAuthor } from '../../src/models/author.js';
import { createAuditLog } from '../../src/models/audit_log.js';
import { createNotification } from '../../src/models/notification.js';
import { createPaper } from '../../src/models/paper.js';
import { accessControl } from '../../src/services/access_control.js';
import { auditLogService } from '../../src/services/audit_log_service.js';
import { authService } from '../../src/services/auth_service.js';
import { decisionRepository } from '../../src/services/decision_repository.js';
import { notificationService } from '../../src/services/notification_service.js';
import { notificationPrefs } from '../../src/services/notification_prefs.js';
import { releaseScheduler } from '../../src/services/release_scheduler.js';
import { decisionStorage } from '../../src/services/storage.js';
import { createDecisionController } from '../../src/controllers/decision_controller.js';
import { createDecisionReleaseController } from '../../src/controllers/decision_release_controller.js';
import { createNotificationSettingsController } from '../../src/controllers/notification_settings_controller.js';
import { router } from '../../src/controllers/router.js';
import { createDecisionDetailView } from '../../src/views/decision_detail_view.js';
import { createDecisionListView } from '../../src/views/decision_list_view.js';
import { createNotificationInboxView } from '../../src/views/notification_inbox_view.js';
import { createNotificationSettingsView } from '../../src/views/notification_settings_view.js';

afterEach(() => {
  decisionRepository.reset();
  notificationService.reset();
  auditLogService.reset();
  decisionStorage.clearAll();
  router.reset();
  localStorage.clear();
  jest.useRealTimers();
});

describe('UC-25 branch coverage', () => {
  test('model helpers cover optional branches', () => {
    const author = createAuthor({ authorId: 'author-1' });
    expect(author.authorId).toBe('author-1');
    expect(createAuthor().authorId).toContain('author_');

    const log = createAuditLog({ logId: 'log-1', createdAt: '2025-01-01T00:00:00.000Z' });
    expect(log.logId).toBe('log-1');
    expect(log.createdAt).toBe('2025-01-01T00:00:00.000Z');
    expect(createAuditLog({ eventType: 'access_denied', relatedId: 'p1' }).logId).toContain('log_');
    expect(createAuditLog().logId).toContain('log_');

    const notification = createNotification({
      notificationId: 'note-1',
      decisionId: 'decision-1',
      paperId: 'paper-1',
      recipientId: 'author-1',
      channels: 'bad',
    });
    expect(notification.notificationId).toBe('note-1');
    expect(notification.channels).toEqual([]);
    const singleChannel = createNotification({ channel: 'email', paperId: 'paper-1', recipientId: 'a1' });
    expect(singleChannel.channels).toEqual(['email']);

    const paper = createPaper({
      paperId: 'paper-1',
      authorIds: 'bad',
      assignedRefereeEmails: 'bad',
      assignmentVersion: 'bad',
    });
    expect(paper.authorIds).toEqual([]);
    expect(paper.assignedRefereeEmails).toEqual([]);
    expect(paper.assignmentVersion).toBe(0);
  });

  test('access control and auth guards cover error branches', () => {
    expect(accessControl.isAuthor()).toBe(false);
    expect(accessControl.isAuthor({ paper: { authorIds: ['a1'] } })).toBe(false);
    expect(accessControl.isAuthor({ paper: { authorIds: 'bad' }, authorId: 'a1' })).toBe(false);
    expect(accessControl.isAuthor({ paper: { authorIds: ['a1'] }, authorId: 'a1' })).toBe(true);

    const onAuthRequired = jest.fn();
    const result = authService.requireAuth({ onAuthRequired });
    expect(result.ok).toBe(false);
    expect(onAuthRequired).toHaveBeenCalled();

    const okResult = authService.requireAuth({
      sessionState: {
        isAuthenticated: () => true,
      },
    });
    expect(okResult.ok).toBe(true);
    expect(okResult.user).toBe(null);

    const failResult = authService.requireAuth({
      sessionState: {
        isAuthenticated: () => false,
      },
    });
    expect(failResult.ok).toBe(false);

    expect(authService.requireAuth().ok).toBe(false);
  });

  test('storage read covers cache and localStorage branches', () => {
    localStorage.setItem('demo', JSON.stringify(['value']));
    expect(decisionStorage.read('demo', [])).toEqual(['value']);
    expect(decisionStorage.read('demo', [])).toEqual(['value']);
  });

  test('audit log prune retains invalid timestamps and drops old entries', () => {
    auditLogService.log();
    auditLogService.log({
      eventType: 'access_denied',
      relatedId: 'p1',
      details: {},
      createdAt: 'invalid',
    });
    auditLogService.log({
      eventType: 'decision_released',
      relatedId: 'p2',
      details: {},
      createdAt: '2020-01-01T00:00:00.000Z',
    });
    auditLogService.log({
      eventType: 'decision_released',
      relatedId: 'p3',
      details: {},
      createdAt: '2025-12-15T00:00:00.000Z',
    });

    const now = Date.parse('2026-01-01T00:00:00.000Z');
    const filtered = auditLogService.pruneOlderThan(90, now);
    expect(filtered.length).toBe(3);
    expect(filtered.some((entry) => entry.createdAt === 'invalid')).toBe(true);
    expect(filtered.some((entry) => entry.createdAt === '2025-12-15T00:00:00.000Z')).toBe(true);
    expect(auditLogService.getLogs().length).toBeGreaterThan(0);
    auditLogService.reset();
    expect(auditLogService.getLogs()).toEqual([]);
    auditLogService.pruneOlderThan();
  });

  test('decision repository release edge cases', () => {
    const paper = createPaper({ paperId: 'paper-2', authorIds: ['a1'], decisionReleaseAt: 'bad-date' });
    decisionRepository.seedPaper(paper);
    decisionRepository.seedDecision({ decisionId: 'd1', paperId: 'paper-2', value: 'accept' });

    const list = decisionRepository.listDecisionsForAuthor({ authorId: 'a1', now: 0 });
    expect(list[0].status).toBe('released');

    expect(decisionRepository.getDecisionById()).toBe(null);

    expect(decisionRepository.getDecisionForAuthor({ paperId: 'missing', authorId: 'a1' }).reason).toBe('paper_not_found');

    decisionRepository.seedPaper(createPaper({ paperId: 'paper-3', authorIds: [] }));
    expect(decisionRepository.getDecisionForAuthor({ paperId: 'paper-3', authorId: 'a1' }).reason).toBe('access_denied');

    decisionRepository.seedPaper(createPaper({ paperId: 'paper-4', authorIds: ['a1'] }));
    expect(decisionRepository.getDecisionForAuthor({ paperId: 'paper-4', authorId: 'a1' }).reason).toBe('decision_missing');

    decisionRepository.seedPaper(createPaper({ paperId: 'paper-5', authorIds: ['a1'], decisionReleaseAt: new Date(Date.now() + 100000).toISOString() }));
    decisionRepository.seedDecision({ decisionId: 'd5', paperId: 'paper-5', value: 'reject' });
    expect(decisionRepository.getDecisionForAuthor({ paperId: 'paper-5', authorId: 'a1' }).reason).toBe('pending');

    const listStatuses = decisionRepository.listDecisionsForAuthor({ authorId: 'a1' });
    expect(listStatuses.some((entry) => entry.status === 'pending')).toBe(true);

    expect(decisionRepository.saveDecision()).toEqual({ ok: false, reason: 'invalid_decision' });

    decisionRepository.seedPaper(createPaper({ paperId: 'paper-6', authorIds: ['a1'] }));
    const missingList = decisionRepository.listDecisionsForAuthor({ authorId: 'a1' });
    expect(missingList.some((entry) => entry.status === 'missing')).toBe(true);

    decisionRepository.seedDecision({ decisionId: 'd6', paperId: 'paper-6', releasedAt: '2026-01-01T00:00:00.000Z' });
    expect(decisionRepository.getDecisionForAuthor({
      paperId: 'paper-6',
      authorId: 'a1',
      now: Date.parse('2026-02-01T00:00:00.000Z'),
    }).ok).toBe(true);

    decisionRepository.seedPaper(createPaper({ paperId: 'paper-7', authorIds: ['a1'], decisionReleaseAt: null }));
    decisionRepository.seedDecision({ decisionId: 'd7', paperId: 'paper-7', releasedAt: null });
    expect(decisionRepository.getDecisionForAuthor({ paperId: 'paper-7', authorId: 'a1', now: 0 }).ok).toBe(true);

    const listDefault = decisionRepository.listDecisionsForAuthor();
    expect(Array.isArray(listDefault)).toBe(true);

    expect(decisionRepository.getDecisionForAuthor().reason).toBe('paper_not_found');

    decisionRepository.seedPaper({ id: 'paper-8', authorIds: ['a1'] });
    decisionRepository.seedDecision({ decisionId: 'd8', paperId: 'paper-8' });
    const idList = decisionRepository.listDecisionsForAuthor({ authorId: 'a1' });
    expect(idList.some((entry) => entry.paper.id === 'paper-8')).toBe(true);

    decisionRepository.seedPaper(createPaper({ paperId: 'paper-9', authorIds: ['a1'], decisionReleaseAt: '2027-01-01T00:00:00.000Z' }));
    decisionRepository.seedDecision({ decisionId: 'd9', paperId: 'paper-9', releasedAt: '2025-01-01T00:00:00.000Z' });
    expect(decisionRepository.getDecisionForAuthor({
      paperId: 'paper-9',
      authorId: 'a1',
      now: Date.parse('2026-01-01T00:00:00.000Z'),
    }).ok).toBe(true);

    decisionRepository.seedPaper(createPaper({ paperId: 'paper-10', authorIds: ['a1'] }));
    decisionRepository.seedDecision({ decisionId: 'd10', paperId: 'paper-10', releasedAt: '' });
    expect(decisionRepository.getDecisionForAuthor({ paperId: 'paper-10', authorId: 'a1', now: 0 }).ok).toBe(true);

    decisionRepository.seedPaper(createPaper({ paperId: 'paper-11', authorIds: ['a1'], decisionReleaseAt: '2026-06-01T00:00:00.000Z' }));
    decisionRepository.seedDecision({ decisionId: 'd11', paperId: 'paper-11', releasedAt: null });
    expect(decisionRepository.getDecisionForAuthor({
      paperId: 'paper-11',
      authorId: 'a1',
      now: Date.parse('2026-01-01T00:00:00.000Z'),
    }).reason).toBe('pending');
  });

  test('notification service missing payload branch', () => {
    const result = notificationService.sendDecisionNotifications();
    expect(result.ok).toBe(false);
    expect(result.reason).toBe('missing_payload');

    const auditSpy = { log: jest.fn() };
    notificationService.setFailureMode();
    const sendResult = notificationService.sendDecisionNotifications({
      paper: { paperId: 'p1' },
      decision: { decisionId: 'd1' },
      authors: [{ authorId: 'a1', email: '' }],
      auditLogService: auditSpy,
    });
    expect(sendResult.ok).toBe(true);
    expect(auditSpy.log).toHaveBeenCalled();

    notificationService.setFailureMode({ email: true, inApp: true });
    const failureResult = notificationService.sendDecisionNotifications({
      paper: { paperId: 'p2' },
      decision: { decisionId: 'd2' },
      authors: [{ authorId: 'a2', email: 'test@example.com' }],
      auditLogService: auditSpy,
    });
    expect(failureResult.ok).toBe(true);

    notificationPrefs.setPreferences('a3', { email: false, inApp: false });
    const skippedResult = notificationService.sendDecisionNotifications({
      paper: { paperId: 'p3' },
      decision: { decisionId: 'd3' },
      authors: [{ authorId: 'a3', email: 'test@example.com' }],
      auditLogService: auditSpy,
    });
    expect(skippedResult.results[0].status).toBe('skipped');

    notificationService.setFailureMode({ email: false, inApp: true });
    notificationPrefs.setPreferences('a4', { email: true, inApp: true });
    const mixedResult = notificationService.sendDecisionNotifications({
      paper: { paperId: 'p4' },
      decision: { decisionId: 'd4' },
      authors: [{ authorId: 'a4', email: 'test@example.com' }],
      auditLogService: auditSpy,
    });
    expect(mixedResult.ok).toBe(true);

    notificationService.setFailureMode({ email: false, inApp: false });
    notificationPrefs.setPreferences('a5', { email: true, inApp: false });
    const emailSuccess = notificationService.sendDecisionNotifications({
      paper: { paperId: 'p5' },
      decision: { decisionId: 'd5' },
      authors: [{ authorId: 'a5', email: 'test@example.com' }],
      auditLogService: auditSpy,
    });
    expect(emailSuccess.results[0].status).toBe('sent');

    notificationService.setFailureMode({ email: true, inApp: false });
    notificationPrefs.setPreferences('a6', { email: true, inApp: false });
    notificationService.sendDecisionNotifications({
      paper: { paperId: 'p6' },
      decision: { decisionId: 'd6' },
      authors: [{ authorId: 'a6', email: 'test@example.com' }],
      auditLogService: auditSpy,
    });

    notificationService.setFailureMode({ email: false, inApp: true });
    notificationPrefs.setPreferences('a7', { email: false, inApp: true });
    notificationService.sendDecisionNotifications({
      paper: { paperId: 'p7' },
      decision: { decisionId: 'd7' },
      authors: [{ authorId: 'a7', email: '' }],
      auditLogService: auditSpy,
    });

    notificationService.setFailureMode({ email: false, inApp: false });
    notificationPrefs.setPreferences('a8', { email: false, inApp: true });
    const inAppSuccess = notificationService.sendDecisionNotifications({
      paper: { paperId: 'p8' },
      decision: { decisionId: 'd8' },
      authors: [{ authorId: 'a8', email: '' }],
      auditLogService: auditSpy,
    });
    expect(inAppSuccess.results[0].status).toBe('sent');

    notificationService.setFailureMode({ email: true, inApp: false });
    notificationPrefs.setPreferences('a9', { email: true, inApp: false });
    notificationService.sendDecisionNotifications({
      paper: { paperId: 'p9' },
      decision: { decisionId: 'd9' },
      authors: [{ authorId: 'a9', email: 'test@example.com' }],
    });
  });

  test('notification service branch matrix coverage', () => {
    notificationService.reset();
    notificationService.setFailureMode({ email: false, inApp: false });
    notificationPrefs.setPreferences('b1', { email: true, inApp: false });
    notificationService.sendDecisionNotifications({
      paper: { paperId: 'pb1' },
      decision: { decisionId: 'db1' },
      authors: [{ id: 'b1', email: '' }],
    });

    notificationService.setFailureMode({ email: true, inApp: false });
    notificationPrefs.setPreferences('b2', { email: true, inApp: false });
    notificationService.sendDecisionNotifications({
      paper: { paperId: 'pb2' },
      decision: { decisionId: 'db2' },
      authors: [{ authorId: 'b2', email: 'test@example.com' }],
    });

    notificationService.setFailureMode({ email: false, inApp: true });
    notificationPrefs.setPreferences('b3', { email: false, inApp: true });
    notificationService.sendDecisionNotifications({
      paper: { paperId: 'pb3' },
      decision: { decisionId: 'db3' },
      authors: [{ authorId: 'b3', email: 'test@example.com' }],
    });

    notificationService.setFailureMode({ email: false, inApp: false });
    notificationPrefs.setPreferences('b4', { email: false, inApp: true });
    notificationService.sendDecisionNotifications({
      paper: { paperId: 'pb4' },
      decision: { decisionId: 'db4' },
      authors: [{ authorId: 'b4', email: 'test@example.com' }],
    });
  });

  test('notification service records failure and success notifications', () => {
    notificationService.reset();
    notificationPrefs.setPreferences('c1', { email: true, inApp: false });
    notificationService.setFailureMode({ email: true, inApp: false });
    notificationService.sendDecisionNotifications({
      paper: { paperId: 'pc1' },
      decision: { decisionId: 'dc1' },
      authors: [{ authorId: 'c1', email: 'test@example.com' }],
    });
    expect(notificationService.getNotifications().some((entry) => entry.reason === 'email_failure')).toBe(true);

    notificationService.reset();
    notificationPrefs.setPreferences('c2', { email: true, inApp: false });
    notificationService.setFailureMode({ email: false, inApp: false });
    notificationService.sendDecisionNotifications({
      paper: { paperId: 'pc2' },
      decision: { decisionId: 'dc2' },
      authors: [{ authorId: 'c2', email: 'test@example.com' }],
    });
    expect(notificationService.getNotifications().some((entry) => entry.channel === 'email')).toBe(true);

    notificationService.reset();
    notificationPrefs.setPreferences('c3', { email: false, inApp: true });
    notificationService.setFailureMode({ email: false, inApp: true });
    notificationService.sendDecisionNotifications({
      paper: { paperId: 'pc3' },
      decision: { decisionId: 'dc3' },
      authors: [{ authorId: 'c3', email: 'test@example.com' }],
    });
    expect(notificationService.getNotifications().some((entry) => entry.reason === 'in_app_failure')).toBe(true);

    notificationService.reset();
    notificationPrefs.setPreferences('c4', { email: false, inApp: true });
    notificationService.setFailureMode({ email: false, inApp: false });
    notificationService.sendDecisionNotifications({
      paper: { paperId: 'pc4' },
      decision: { decisionId: 'dc4' },
      authors: [{ authorId: 'c4', email: 'test@example.com' }],
    });
    expect(notificationService.getNotifications().some((entry) => entry.channel === 'in_app')).toBe(true);

    notificationService.reset();
    notificationPrefs.setPreferences('c5', { email: true, inApp: false });
    notificationService.setFailureMode({ email: true, inApp: false });
    notificationService.sendDecisionNotifications({
      paper: { id: 'pc5' },
      decision: { decisionId: 'dc5' },
      authors: [{ authorId: 'c5', email: 'test@example.com' }],
    });

    notificationService.reset();
    notificationPrefs.setPreferences('c6', { email: true, inApp: false });
    notificationService.setFailureMode({ email: false, inApp: false });
    notificationService.sendDecisionNotifications({
      paper: { id: 'pc6' },
      decision: { decisionId: 'dc6' },
      authors: [{ authorId: 'c6', email: 'test@example.com' }],
    });

    notificationService.reset();
    notificationPrefs.setPreferences('c7', { email: false, inApp: true });
    notificationService.setFailureMode({ email: false, inApp: true });
    notificationService.sendDecisionNotifications({
      paper: { id: 'pc7' },
      decision: { decisionId: 'dc7' },
      authors: [{ authorId: 'c7', email: 'test@example.com' }],
    });

    notificationService.reset();
    notificationPrefs.setPreferences('c8', { email: false, inApp: true });
    notificationService.setFailureMode({ email: false, inApp: false });
    notificationService.sendDecisionNotifications({
      paper: { id: 'pc8' },
      decision: { decisionId: 'dc8' },
      authors: [{ authorId: 'c8', email: 'test@example.com' }],
    });
  });

  test('release scheduler delay branches', () => {
    const now = Date.parse('2026-02-01T00:00:00.000Z');
    expect(releaseScheduler.getDelayMs(null, now)).toBe(0);
    expect(releaseScheduler.getDelayMs('invalid', now)).toBe(0);
    expect(releaseScheduler.isReleased('invalid', now)).toBe(true);
    expect(releaseScheduler.getDelayMs('2026-02-02T00:00:00.000Z')).toBeGreaterThanOrEqual(0);

    const onRelease = jest.fn();
    const scheduleImmediate = releaseScheduler.schedule({ releaseAt: null, onRelease, now });
    expect(onRelease).toHaveBeenCalledTimes(1);
    expect(typeof scheduleImmediate.cancel).toBe('function');

    jest.useFakeTimers();
    const future = new Date(now + 1000).toISOString();
    const onFutureRelease = jest.fn();
    const scheduleFuture = releaseScheduler.schedule({ releaseAt: future, onRelease: onFutureRelease, now });
    scheduleFuture.cancel();
    jest.advanceTimersByTime(1500);
    expect(onFutureRelease).not.toHaveBeenCalled();

    const onLateRelease = jest.fn();
    releaseScheduler.schedule({ releaseAt: future, onRelease: onLateRelease, now });
    jest.advanceTimersByTime(1500);
    expect(onLateRelease).toHaveBeenCalledTimes(1);

    const onDelayedRelease = jest.fn();
    releaseScheduler.schedule({ releaseAt: future, onRelease: onDelayedRelease, now });
    jest.runAllTimers();
    expect(onDelayedRelease).toHaveBeenCalledTimes(1);

    releaseScheduler.schedule({ releaseAt: future, now });

    releaseScheduler.schedule({});
    releaseScheduler.schedule();
    releaseScheduler.schedule({ releaseAt: null });

    const onShortRelease = jest.fn();
    const shortNow = Date.parse('2026-02-01T00:00:00.000Z');
    const shortFuture = new Date(shortNow + 50).toISOString();
    releaseScheduler.schedule({ releaseAt: shortFuture, onRelease: onShortRelease, now: shortNow });
    jest.advanceTimersByTime(60);
    expect(onShortRelease).toHaveBeenCalledTimes(1);

    const onPending = jest.fn();
    const pendingFuture = new Date(shortNow + 200).toISOString();
    releaseScheduler.schedule({ releaseAt: pendingFuture, onRelease: onPending, now: shortNow });
    jest.runOnlyPendingTimers();
    expect(onPending).toHaveBeenCalledTimes(1);
  });

  test('decision controller covers auth fail, missing views, and access denied log', () => {
    const sessionState = {
      isAuthenticated: () => false,
      getCurrentUser: () => ({ id: 'a1' }),
    };
    const listView = createDecisionListView();
    const controller = createDecisionController({
      listView,
      detailView: null,
      sessionState,
      authService,
      decisionRepository,
      auditLogService,
    });

    controller.init();
    controller.showDecision('paper-1');

    sessionState.isAuthenticated = () => true;
    decisionRepository.seedPaper(createPaper({ paperId: 'paper-1', authorIds: [] }));
    decisionRepository.seedDecision({ decisionId: 'd1', paperId: 'paper-1', value: 'reject' });

    const detailView = createDecisionDetailView();
    const controllerWithDetail = createDecisionController({
      listView: null,
      detailView,
      sessionState,
      authService,
      decisionRepository,
      auditLogService,
    });

    controllerWithDetail.init();
    controllerWithDetail.showDecision('paper-1');
    expect(auditLogService.getLogs().length).toBeGreaterThan(0);

    const listViewStub = {
      setDecisions: jest.fn(),
      onSelect: jest.fn(),
    };
    const controllerWithList = createDecisionController({
      listView: listViewStub,
      detailView: null,
      sessionState,
      authService,
      decisionRepository,
    });
    controllerWithList.init();
    controllerWithList.showDecision('paper-1');
    controllerWithList.stopRefresh();

    const nullUserController = createDecisionController({
      listView: listViewStub,
      detailView: createDecisionDetailView(),
      sessionState: {
        isAuthenticated: () => true,
        getCurrentUser: () => null,
      },
      decisionRepository: {
        listDecisionsForAuthor: () => [],
        getDecisionForAuthor: () => ({ ok: false, reason: 'access_denied' }),
      },
      auditLogService: null,
    });
    nullUserController.init();
    nullUserController.showDecision('paper-null');
  });

  test('decision controller pending refresh and resume flows', () => {
    jest.useFakeTimers();
    const pendingView = createDecisionDetailView();
    const controller = createDecisionController({
      detailView: pendingView,
      sessionState: {
        isAuthenticated: () => true,
        getCurrentUser: () => ({ id: 'a1' }),
      },
      decisionRepository: {
        getDecisionForAuthor: () => ({ ok: false, reason: 'pending', paper: { decisionReleaseAt: '2026-02-01T00:00:00.000Z' } }),
        listDecisionsForAuthor: () => [],
      },
      auditLogService,
    });

    controller.showDecision('paper-pending');
    controller.showDecision('paper-pending', { skipTimer: true });
    jest.advanceTimersByTime(60000);
    controller.stopRefresh();

    const defaultController = createDecisionController();
    defaultController.showDecision('paper-default');
    defaultController.resumePending();

    const noIdController = createDecisionController({
      detailView: createDecisionDetailView(),
      sessionState: {
        isAuthenticated: () => true,
        getCurrentUser: () => ({}),
      },
      decisionRepository: {
        getDecisionForAuthor: () => ({ ok: false, reason: 'access_denied' }),
        listDecisionsForAuthor: () => [],
      },
      auditLogService: null,
    });
    noIdController.showDecision('paper-noid');

    const pendingState = {
      isAuthenticated: () => false,
      getCurrentUser: () => null,
    };
    const resumeController = createDecisionController({
      detailView: createDecisionDetailView(),
      sessionState: pendingState,
      decisionRepository: {
        getDecisionForAuthor: () => ({ ok: true, paper: { paperId: 'p1' }, decision: { value: 'accept' } }),
        listDecisionsForAuthor: () => [],
      },
    });
    resumeController.showDecision('paper-resume');
    pendingState.isAuthenticated = () => true;
    resumeController.resumePending();
    resumeController.resumePending();

    const noGetterController = createDecisionController({
      detailView: createDecisionDetailView(),
      sessionState: {
        isAuthenticated: () => true,
      },
      decisionRepository: {
        getDecisionForAuthor: () => ({ ok: false, reason: 'pending', paper: { decisionReleaseAt: null } }),
        listDecisionsForAuthor: () => [],
      },
    });
    noGetterController.showDecision('paper-nogetter');
  });

  test('decision release controller error branches', () => {
    const controller = createDecisionReleaseController({
      decisionRepository,
      notificationService,
      auditLogService,
      releaseScheduler,
    });

    const missingPayload = controller.scheduleRelease();
    expect(missingPayload.ok).toBe(false);

    expect(controller.releaseDecisionById('missing').status).toBe(409);

    decisionRepository.seedDecision({ decisionId: 'd1', paperId: 'p1', releasedAt: '2026-01-01T00:00:00.000Z' });
    expect(controller.releaseDecisionById('d1').reason).toBe('already_released');

    decisionRepository.seedPaper(createPaper({ paperId: 'p2', decisionReleaseAt: new Date(Date.now() + 100000).toISOString() }));
    decisionRepository.seedDecision({ decisionId: 'd2', paperId: 'p2' });
    expect(controller.releaseDecisionById('d2').reason).toBe('release_pending');

    const scheduleSpy = jest.fn(() => ({ cancel: jest.fn() }));
    const releaseController = createDecisionReleaseController({
      decisionRepository,
      notificationService,
      auditLogService,
      releaseScheduler: { schedule: scheduleSpy, isReleased: releaseScheduler.isReleased },
    });
    const scheduleResult = releaseController.scheduleRelease({
      paper: { paperId: 'p3' },
      decision: { decisionId: 'd3', paperId: 'p3' },
      authors: [],
      releaseAt: '2026-02-01T00:00:00.000Z',
    });
    expect(scheduleResult.ok).toBe(true);
    expect(scheduleSpy).toHaveBeenCalled();

    const immediateController = createDecisionReleaseController({
      decisionRepository,
      notificationService,
      auditLogService,
      releaseScheduler: {
        schedule: ({ onRelease }) => {
          if (onRelease) {
            onRelease();
          }
          return { cancel: jest.fn() };
        },
        isReleased: releaseScheduler.isReleased,
      },
    });
    immediateController.scheduleRelease({
      paper: { paperId: 'p4' },
      decision: { decisionId: 'd4', paperId: 'p4' },
      authors: [],
    });

    immediateController.releaseNow({
      paper: { paperId: 'p5' },
      decision: { decisionId: 'd5', paperId: 'p5' },
      authors: [],
    });

    const defaultReleaseController = createDecisionReleaseController();
    defaultReleaseController.releaseNow({
      paper: { paperId: 'p6' },
      decision: { decisionId: 'd6', paperId: 'p6' },
      authors: [],
    });

    defaultReleaseController.releaseNow({
      paper: { id: 'p7' },
      decision: { decisionId: 'd7', paperId: 'p7' },
      authors: [],
    });

    expect(() => defaultReleaseController.releaseNow()).toThrow();
  });

  test('notification settings controller no view branch', () => {
    const controller = createNotificationSettingsController({ view: null, authorId: 'a1' });
    controller.init();

    const defaultController = createNotificationSettingsController();
    defaultController.init();
  });

  test('notification settings controller init wires view', () => {
    const view = createNotificationSettingsView();
    const controller = createNotificationSettingsController({ view, authorId: 'a1' });
    controller.init();
    const form = view.element.querySelector('form');
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    expect(view.element.querySelector('#notification-settings-status').textContent).toContain('Preferences saved');
  });

  test('router coverage for root/view branches', () => {
    expect(router.navigate('missing')).toBe(false);
    router.registerDecisionRoutes();
    router.register('noroot', () => document.createElement('div'));
    expect(router.navigate('noroot')).toBe(true);

    router.setRoot(document.createElement('div'));
    router.register('test', () => null);
    expect(router.navigate('test')).toBe(true);

    const viewElement = document.createElement('div');
    const controller = {
      listView: { element: viewElement },
      detailView: { element: viewElement },
      init: jest.fn(),
      showDecision: jest.fn(),
    };
    router.registerDecisionRoutes({ controller });
    expect(router.navigate('decisions')).toBe(true);
    expect(router.navigate('decision-detail', { paperId: 'p1' })).toBe(true);

    const controllerNoViews = {
      listView: null,
      detailView: null,
      init: jest.fn(),
      showDecision: jest.fn(),
    };
    router.registerDecisionRoutes({ controller: controllerNoViews });
    expect(router.navigate('decisions')).toBe(true);
    expect(router.navigate('decision-detail', { paperId: 'p2' })).toBe(true);
    expect(router.navigate('decision-detail', {})).toBe(true);

    router.register('object-view', () => ({ element: document.createElement('div') }));
    expect(router.navigate('object-view')).toBe(true);
  });

  test('view branch coverage for status and empty states', () => {
    const detailView = createDecisionDetailView();
    detailView.setStatus('', false);
    detailView.setStatus('Error', true);
    detailView.setDecision({ paper: { title: 'Paper A' }, decision: { value: 'accept', notes: 'Nice' } });
    detailView.setDecision({ paper: { paperId: 'p1' }, decision: { notes: '' } });
    detailView.setDecision({ decision: { value: '' } });
    detailView.setDecision();
    detailView.setPending();
    detailView.setPending('2026-02-01T00:00:00.000Z');

    const listView = createDecisionListView();
    listView.setStatus('', false);
    listView.setStatus('Error', true);
    listView.setDecisions();
    listView.setDecisions(null);
    const onSelect = jest.fn();
    listView.onSelect(onSelect);
    listView.setDecisions([
      { paper: { paperId: 'p1', title: 'Paper One' }, decision: { value: 'accept' }, status: 'released' },
      { paper: { paperId: 'p2' }, decision: null, status: 'pending' },
      { paper: { id: 'p3' }, decision: null, status: 'missing' },
      { paper: {}, decision: { value: 'reject' }, status: 'released' },
    ]);
    const listButtons = listView.element.querySelectorAll('button');
    listButtons[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    listButtons[2].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onSelect).toHaveBeenCalled();

    const listViewNoHandler = createDecisionListView();
    listViewNoHandler.setDecisions([{ paper: { paperId: 'p9' }, decision: { value: 'accept' }, status: 'released' }]);
    listViewNoHandler.element.querySelector('button').click();

    const inboxView = createNotificationInboxView();
    inboxView.setNotifications();
    inboxView.setNotifications(null);
    inboxView.setNotifications([{ channels: ['email'], editorId: 'p1' }]);
    inboxView.setNotifications([{ editorId: 'p2' }]);
    inboxView.setNotifications([{ channel: 'email', paperId: 'p3' }]);
    inboxView.setNotifications([{ channel: '', paperId: '' }]);

    const settingsView = createNotificationSettingsView();
    settingsView.setStatus('', false);
    settingsView.setStatus('Error', true);
    settingsView.setPreferences();
    settingsView.setPreferences({ email: true, inApp: false });
    expect(settingsView.getPreferences().email).toBe(true);
  });
});
