import { jest } from '@jest/globals';
import { createRefereeAssignmentController } from '../../src/controllers/referee-assignment-controller.js';
import { UI_MESSAGES } from '../../src/services/ui-messages.js';

function createViewStub() {
  let submitHandler = null;
  return {
    view: {
      clearErrors: jest.fn(),
      setAuthorizationMessage: jest.fn(),
      setWarning: jest.fn(),
      setStatus: jest.fn(),
      setSummary: jest.fn(() => true),
      setFallbackSummary: jest.fn(),
      setFieldError: jest.fn(),
      setCountError: jest.fn(),
      setPaper: jest.fn(),
      setEditable: jest.fn(),
      showConfirmation: jest.fn(),
      getRefereeEmails: jest.fn(() => ['a@example.com', '', 'c@example.com']),
      onSubmit: (handler) => { submitHandler = handler; },
    },
    submit() {
      submitHandler({ preventDefault: jest.fn() });
    },
  };
}

function createMocks(overrides = {}) {
  return {
    assignmentStorage: {
      getPaper: jest.fn(() => ({
        id: 'paper_1',
        title: 'Paper',
        status: 'Submitted',
        assignedRefereeEmails: [],
        assignmentVersion: 0,
      })),
      ...overrides.assignmentStorage,
    },
    assignmentService: {
      submitAssignments: jest.fn(() => ({
        ok: true,
        accepted: ['a@example.com', 'c@example.com'],
        blocked: [],
        violations: [],
      })),
      ...overrides.assignmentService,
    },
    violationLog: {
      logFailure: jest.fn(),
      ...overrides.violationLog,
    },
    sessionState: {
      isAuthenticated: jest.fn(() => true),
      getCurrentUser: jest.fn(() => ({ id: 'acct_1', role: 'Editor' })),
      ...overrides.sessionState,
    },
    onAuthRequired: overrides.onAuthRequired,
  };
}

test('blocks unauthenticated users and triggers auth callback', () => {
  const { view, submit } = createViewStub();
  const onAuthRequired = jest.fn();
  const mocks = createMocks({
    sessionState: { isAuthenticated: jest.fn(() => false) },
    onAuthRequired,
  });
  const controller = createRefereeAssignmentController({
    view,
    assignmentStorage: mocks.assignmentStorage,
    assignmentService: mocks.assignmentService,
    violationLog: mocks.violationLog,
    sessionState: mocks.sessionState,
    paperId: 'paper_1',
    onAuthRequired,
  });
  controller.init();
  submit();
  expect(view.setStatus).toHaveBeenCalledWith(UI_MESSAGES.errors.accessDenied.message, true);
  expect(onAuthRequired).toHaveBeenCalled();
});

test('blocks non-editor users with authorization message', () => {
  const { view, submit } = createViewStub();
  const mocks = createMocks({
    sessionState: { isAuthenticated: jest.fn(() => true), getCurrentUser: jest.fn(() => ({ role: 'Author' })) },
  });
  const controller = createRefereeAssignmentController({
    view,
    assignmentStorage: mocks.assignmentStorage,
    assignmentService: mocks.assignmentService,
    violationLog: mocks.violationLog,
    sessionState: mocks.sessionState,
    paperId: 'paper_1',
  });
  controller.init();
  submit();
  expect(view.setAuthorizationMessage).toHaveBeenCalledWith('You do not have permission to assign referees.');
});

test('blocks users without role', () => {
  const { view, submit } = createViewStub();
  const mocks = createMocks({
    sessionState: { isAuthenticated: jest.fn(() => true), getCurrentUser: jest.fn(() => ({ id: 'acct_2' })) },
  });
  const controller = createRefereeAssignmentController({
    view,
    assignmentStorage: mocks.assignmentStorage,
    assignmentService: mocks.assignmentService,
    violationLog: mocks.violationLog,
    sessionState: mocks.sessionState,
    paperId: 'paper_1',
  });
  controller.init();
  submit();
  expect(view.setAuthorizationMessage).toHaveBeenCalledWith('You do not have permission to assign referees.');
});

test('handles missing paper on init', () => {
  const { view } = createViewStub();
  const mocks = createMocks({ assignmentStorage: { getPaper: jest.fn(() => null) } });
  const controller = createRefereeAssignmentController({
    view,
    assignmentStorage: mocks.assignmentStorage,
    assignmentService: mocks.assignmentService,
    violationLog: mocks.violationLog,
    sessionState: mocks.sessionState,
    paperId: 'missing',
  });
  controller.init();
  expect(view.setStatus).toHaveBeenCalledWith('Paper not found.', true);
  expect(view.setEditable).toHaveBeenCalledWith(false);
});

test('stops submit when paper cannot be loaded', () => {
  const { view, submit } = createViewStub();
  const getPaper = jest.fn(() => null);
  const mocks = createMocks({ assignmentStorage: { getPaper } });
  const controller = createRefereeAssignmentController({
    view,
    assignmentStorage: mocks.assignmentStorage,
    assignmentService: mocks.assignmentService,
    violationLog: mocks.violationLog,
    sessionState: mocks.sessionState,
    paperId: 'missing',
  });
  controller.init();
  submit();
  expect(getPaper).toHaveBeenCalledTimes(2);
});

test('blocks when no emails are entered', () => {
  const { view, submit } = createViewStub();
  view.getRefereeEmails = jest.fn(() => ['', '', '']);
  const mocks = createMocks();
  const controller = createRefereeAssignmentController({
    view,
    assignmentStorage: mocks.assignmentStorage,
    assignmentService: mocks.assignmentService,
    violationLog: mocks.violationLog,
    sessionState: mocks.sessionState,
    paperId: 'paper_1',
  });
  controller.init();
  submit();
  expect(view.setCountError).toHaveBeenCalledWith('Enter at least one referee email.');
  expect(view.setStatus).toHaveBeenCalledWith('Please enter at least one referee email.', true);
});

test('marks invalid and duplicate emails as field errors', () => {
  const { view, submit } = createViewStub();
  view.getRefereeEmails = jest.fn(() => ['bad', 'dup@example.com', 'dup@example.com']);
  const mocks = createMocks();
  const controller = createRefereeAssignmentController({
    view,
    assignmentStorage: mocks.assignmentStorage,
    assignmentService: mocks.assignmentService,
    violationLog: mocks.violationLog,
    sessionState: mocks.sessionState,
    paperId: 'paper_1',
  });
  controller.init();
  submit();
  expect(view.setFieldError).toHaveBeenCalled();
});

test('blocks on evaluation failure and logs it', () => {
  const { view, submit } = createViewStub();
  const mocks = createMocks({
    assignmentService: { submitAssignments: jest.fn(() => ({ ok: false, failure: 'evaluation_failed' })) },
  });
  const controller = createRefereeAssignmentController({
    view,
    assignmentStorage: mocks.assignmentStorage,
    assignmentService: mocks.assignmentService,
    violationLog: mocks.violationLog,
    sessionState: mocks.sessionState,
    paperId: 'paper_1',
  });
  controller.init();
  submit();
  expect(view.setStatus).toHaveBeenCalledWith('Assignments cannot be completed right now. Please try again.', true);
  expect(mocks.violationLog.logFailure).toHaveBeenCalled();
});

test('blocks on evaluation failure without logger', () => {
  const { view, submit } = createViewStub();
  const mocks = createMocks({
    assignmentService: { submitAssignments: jest.fn(() => ({ ok: false, failure: 'evaluation_failed' })) },
    violationLog: null,
  });
  const controller = createRefereeAssignmentController({
    view,
    assignmentStorage: mocks.assignmentStorage,
    assignmentService: mocks.assignmentService,
    violationLog: null,
    sessionState: mocks.sessionState,
    paperId: 'paper_1',
  });
  controller.init();
  submit();
  expect(view.setStatus).toHaveBeenCalledWith('Assignments cannot be completed right now. Please try again.', true);
});

test('falls back when summary UI fails', () => {
  const { view, submit } = createViewStub();
  view.setSummary = jest.fn(() => false);
  const mocks = createMocks();
  const controller = createRefereeAssignmentController({
    view,
    assignmentStorage: mocks.assignmentStorage,
    assignmentService: mocks.assignmentService,
    violationLog: mocks.violationLog,
    sessionState: mocks.sessionState,
    paperId: 'paper_1',
  });
  controller.init();
  submit();
  expect(view.setFallbackSummary).toHaveBeenCalled();
  expect(mocks.violationLog.logFailure).toHaveBeenCalled();
});

test('falls back when summary UI fails without logger', () => {
  const { view, submit } = createViewStub();
  view.setSummary = jest.fn(() => false);
  const mocks = createMocks({ violationLog: null });
  const controller = createRefereeAssignmentController({
    view,
    assignmentStorage: mocks.assignmentStorage,
    assignmentService: mocks.assignmentService,
    violationLog: null,
    sessionState: mocks.sessionState,
    paperId: 'paper_1',
  });
  controller.init();
  submit();
  expect(view.setFallbackSummary).toHaveBeenCalled();
});

test('shows confirmation when all requests sent', () => {
  const { view, submit } = createViewStub();
  const mocks = createMocks({
    assignmentService: { submitAssignments: jest.fn(() => ({ ok: true, accepted: ['a@example.com'], blocked: [], violations: [] })) },
  });
  const controller = createRefereeAssignmentController({
    view,
    assignmentStorage: mocks.assignmentStorage,
    assignmentService: mocks.assignmentService,
    violationLog: mocks.violationLog,
    sessionState: mocks.sessionState,
    paperId: 'paper_1',
  });
  controller.init();
  submit();
  expect(view.showConfirmation).toHaveBeenCalledWith('paper_1', ['a@example.com']);
});

test('sets status when some requests are blocked', () => {
  const { view, submit } = createViewStub();
  const mocks = createMocks({
    assignmentService: { submitAssignments: jest.fn(() => ({
      ok: true,
      accepted: ['a@example.com'],
      blocked: [{ email: 'b@example.com', reason: 'limit_reached' }],
      violations: [],
    })) },
  });
  const controller = createRefereeAssignmentController({
    view,
    assignmentStorage: mocks.assignmentStorage,
    assignmentService: mocks.assignmentService,
    violationLog: mocks.violationLog,
    sessionState: mocks.sessionState,
    paperId: 'paper_1',
  });
  controller.init();
  submit();
  expect(view.setStatus).toHaveBeenCalledWith('Review requests sent with some blocked.', false);
});

test('shows no-requests message when all blocked', () => {
  const { view, submit } = createViewStub();
  const mocks = createMocks({
    assignmentService: { submitAssignments: jest.fn(() => ({
      ok: true,
      accepted: [],
      blocked: [{ email: 'b@example.com', reason: 'invalid_email' }],
      violations: [],
    })) },
  });
  const controller = createRefereeAssignmentController({
    view,
    assignmentStorage: mocks.assignmentStorage,
    assignmentService: mocks.assignmentService,
    violationLog: mocks.violationLog,
    sessionState: mocks.sessionState,
    paperId: 'paper_1',
  });
  controller.init();
  submit();
  expect(view.setStatus).toHaveBeenCalledWith('No review requests were sent.', true);
});

test('falls back to default reason for unknown blocks', () => {
  const { view, submit } = createViewStub();
  const mocks = createMocks({
    assignmentService: { submitAssignments: jest.fn(() => ({
      ok: true,
      accepted: [],
      blocked: [{ email: 'b@example.com', reason: 'mystery' }],
      violations: [],
    })) },
  });
  const controller = createRefereeAssignmentController({
    view,
    assignmentStorage: mocks.assignmentStorage,
    assignmentService: mocks.assignmentService,
    violationLog: mocks.violationLog,
    sessionState: mocks.sessionState,
    paperId: 'paper_1',
  });
  controller.init();
  submit();
  const summaryArg = view.setSummary.mock.calls[view.setSummary.mock.calls.length - 1][0];
  expect(summaryArg.blocked[0].reason).toBe('Review request could not be delivered.');
});

test('does not set no-requests message when no entries exist', () => {
  const { view, submit } = createViewStub();
  const mocks = createMocks({
    assignmentService: { submitAssignments: jest.fn(() => ({
      ok: true,
      accepted: [],
      blocked: [],
      violations: [],
    })) },
  });
  const controller = createRefereeAssignmentController({
    view,
    assignmentStorage: mocks.assignmentStorage,
    assignmentService: mocks.assignmentService,
    violationLog: mocks.violationLog,
    sessionState: mocks.sessionState,
    paperId: 'paper_1',
  });
  controller.init();
  submit();
  expect(view.setStatus).not.toHaveBeenCalledWith('No review requests were sent.', true);
});
