import { jest } from '@jest/globals';
import { createReviewReadinessController } from '../../src/controllers/review-readiness-controller.js';
import { UI_MESSAGES } from '../../src/services/ui-messages.js';

function createViewStub() {
  return {
    setStatus: jest.fn(),
    setMissingInvitations: jest.fn(),
    setGuidance: jest.fn(),
    setCount: jest.fn(),
    setAuthorizationMessage: jest.fn(),
    setPaper: jest.fn(),
  };
}

function createGuidanceViewStub() {
  return {
    setGuidance: jest.fn(),
    onAction: jest.fn(),
  };
}

function createSessionState(overrides = {}) {
  return {
    isAuthenticated: jest.fn(() => true),
    getCurrentUser: jest.fn(() => ({ role: 'Editor' })),
    ...overrides,
  };
}

test('blocks unauthenticated users and triggers auth callback', () => {
  const view = createViewStub();
  const onAuthRequired = jest.fn();
  const controller = createReviewReadinessController({
    view,
    assignmentStorage: { getPaper: jest.fn() },
    reviewRequestStore: {},
    sessionState: createSessionState({ isAuthenticated: jest.fn(() => false) }),
    paperId: 'paper_1',
    readinessService: { evaluate: jest.fn() },
    onAuthRequired,
  });

  const result = controller.evaluateReadiness();
  expect(result).toEqual({ ok: false, ready: false, reason: 'unauthorized' });
  expect(view.setStatus).toHaveBeenCalledWith(UI_MESSAGES.errors.accessDenied.message, true);
  expect(onAuthRequired).toHaveBeenCalled();
});

test('blocks non-editor users with authorization message', () => {
  const view = createViewStub();
  const controller = createReviewReadinessController({
    view,
    assignmentStorage: { getPaper: jest.fn() },
    reviewRequestStore: {},
    sessionState: createSessionState({ getCurrentUser: jest.fn(() => ({ role: 'Author' })) }),
    paperId: 'paper_1',
    readinessService: { evaluate: jest.fn() },
  });

  const result = controller.evaluateReadiness();
  expect(result).toEqual({ ok: false, ready: false, reason: 'unauthorized' });
  expect(view.setAuthorizationMessage).toHaveBeenCalledWith('You do not have permission to start review.');
});

test('blocks users missing role information', () => {
  const view = createViewStub();
  const controller = createReviewReadinessController({
    view,
    assignmentStorage: { getPaper: jest.fn() },
    reviewRequestStore: {},
    sessionState: createSessionState({ getCurrentUser: jest.fn(() => ({})) }),
    paperId: 'paper_1',
    readinessService: { evaluate: jest.fn() },
  });

  const result = controller.evaluateReadiness();
  expect(result).toEqual({ ok: false, ready: false, reason: 'unauthorized' });
  expect(view.setAuthorizationMessage).toHaveBeenCalledWith('You do not have permission to start review.');
});

test('returns paper_not_found when paper missing', () => {
  const view = createViewStub();
  const controller = createReviewReadinessController({
    view,
    assignmentStorage: { getPaper: jest.fn(() => null) },
    reviewRequestStore: {},
    sessionState: createSessionState(),
    paperId: 'missing',
    readinessService: { evaluate: jest.fn() },
  });

  const result = controller.evaluateReadiness();
  expect(result).toEqual({ ok: false, ready: false, reason: 'paper_not_found' });
  expect(view.setStatus).toHaveBeenCalledWith('Paper not found.', true);
});

test('renders readiness block with guidance and missing invitations', () => {
  const view = createViewStub();
  const guidanceView = createGuidanceViewStub();
  const guidanceService = { getGuidance: jest.fn(() => ({ message: 'Add', actionLabel: 'Add', action: 'add' })) };
  const readinessService = {
    evaluate: jest.fn(() => ({
      ok: true,
      ready: false,
      count: 2,
      missingInvitations: ['a@example.com'],
    })),
  };

  const controller = createReviewReadinessController({
    view,
    guidanceView,
    assignmentStorage: { getPaper: jest.fn(() => ({ id: 'paper_1', title: 'Paper' })) },
    reviewRequestStore: {},
    sessionState: createSessionState(),
    paperId: 'paper_1',
    readinessService,
    guidanceService,
  });

  const result = controller.evaluateReadiness();
  expect(result.ready).toBe(false);
  expect(view.setStatus).toHaveBeenCalledWith('Review blocked. Paper has 2 non-declined referee assignments.', true);
  expect(view.setCount).toHaveBeenCalledWith(2);
  expect(view.setMissingInvitations).toHaveBeenCalledWith(['a@example.com']);
  expect(guidanceView.setGuidance).toHaveBeenCalledWith({ message: 'Add', actionLabel: 'Add', action: 'add' });
});

test('renders readiness success when count is three', () => {
  const view = createViewStub();
  const readinessService = {
    evaluate: jest.fn(() => ({ ok: true, ready: true, count: 3, missingInvitations: [] })),
  };
  const controller = createReviewReadinessController({
    view,
    assignmentStorage: { getPaper: jest.fn(() => ({ id: 'paper_2', title: 'Paper' })) },
    reviewRequestStore: {},
    sessionState: createSessionState(),
    paperId: 'paper_2',
    readinessService,
  });

  const result = controller.evaluateReadiness();
  expect(result.ready).toBe(true);
  expect(view.setStatus).toHaveBeenCalledWith('Paper is ready for review.', false);
  expect(view.setCount).toHaveBeenCalledWith(3);
});

test('handles readiness evaluation failures', () => {
  const view = createViewStub();
  const readinessService = { evaluate: jest.fn(() => ({ ok: false, ready: false })) };
  const controller = createReviewReadinessController({
    view,
    assignmentStorage: { getPaper: jest.fn(() => ({ id: 'paper_3', title: 'Paper' })) },
    reviewRequestStore: {},
    sessionState: createSessionState(),
    paperId: 'paper_3',
    readinessService,
  });

  const result = controller.evaluateReadiness();
  expect(result.ok).toBe(false);
  expect(view.setStatus).toHaveBeenCalledWith('Unable to determine referee count. Please try again.', true);
  expect(view.setCount).toHaveBeenCalledWith(null);
});

test('wires guidance action on init', () => {
  const view = createViewStub();
  const guidanceView = createGuidanceViewStub();
  const onGuidanceAction = jest.fn();
  const controller = createReviewReadinessController({
    view,
    guidanceView,
    assignmentStorage: { getPaper: jest.fn(() => ({ id: 'paper_4', title: 'Paper' })) },
    reviewRequestStore: {},
    sessionState: createSessionState(),
    paperId: 'paper_4',
    readinessService: { evaluate: jest.fn() },
    onGuidanceAction,
  });

  controller.init();
  expect(guidanceView.onAction).toHaveBeenCalledWith(onGuidanceAction);
});

test('creates controller with default arguments', () => {
  const controller = createReviewReadinessController();
  expect(typeof controller.init).toBe('function');
});

test('unauthenticated users without auth callback are still blocked', () => {
  const view = createViewStub();
  const controller = createReviewReadinessController({
    view,
    assignmentStorage: { getPaper: jest.fn() },
    reviewRequestStore: {},
    sessionState: createSessionState({ isAuthenticated: jest.fn(() => false) }),
    paperId: 'paper_9',
    readinessService: { evaluate: jest.fn() },
  });

  const result = controller.evaluateReadiness();
  expect(result).toEqual({ ok: false, ready: false, reason: 'unauthorized' });
});

test('handles missing guidance response', () => {
  const view = createViewStub();
  const guidanceView = createGuidanceViewStub();
  const controller = createReviewReadinessController({
    view,
    guidanceView,
    assignmentStorage: { getPaper: jest.fn(() => ({ id: 'paper_10', title: 'Paper' })) },
    reviewRequestStore: {},
    sessionState: createSessionState(),
    paperId: 'paper_10',
    readinessService: { evaluate: jest.fn(() => ({ ok: true, ready: false, count: 2, missingInvitations: [] })) },
    guidanceService: { getGuidance: jest.fn(() => null) },
  });

  const result = controller.evaluateReadiness();
  expect(result.ready).toBe(false);
  expect(guidanceView.setGuidance).toHaveBeenCalledWith({ message: '', actionLabel: '', action: null });
});
