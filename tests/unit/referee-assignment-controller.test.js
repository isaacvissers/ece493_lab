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
      setFieldError: jest.fn(),
      setCountError: jest.fn(),
      setPaper: jest.fn(),
      setEditable: jest.fn(),
      showConfirmation: jest.fn(),
      getRefereeEmails: jest.fn(() => ['a@example.com', 'b@example.com', 'c@example.com']),
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
      saveAssignments: jest.fn(() => ({
        id: 'paper_1',
        title: 'Paper',
        status: 'Submitted',
        assignedRefereeEmails: ['a@example.com', 'b@example.com', 'c@example.com'],
        assignmentVersion: 1,
      })),
      ...overrides.assignmentStorage,
    },
    notificationService: {
      sendNotifications: jest.fn(() => ({ ok: true, failures: [] })),
      ...overrides.notificationService,
    },
    assignmentErrorLog: {
      logFailure: jest.fn(),
      ...overrides.assignmentErrorLog,
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
    notificationService: mocks.notificationService,
    assignmentErrorLog: mocks.assignmentErrorLog,
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
    notificationService: mocks.notificationService,
    assignmentErrorLog: mocks.assignmentErrorLog,
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
    notificationService: mocks.notificationService,
    assignmentErrorLog: mocks.assignmentErrorLog,
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
    notificationService: mocks.notificationService,
    assignmentErrorLog: mocks.assignmentErrorLog,
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
    notificationService: mocks.notificationService,
    assignmentErrorLog: mocks.assignmentErrorLog,
    sessionState: mocks.sessionState,
    paperId: 'missing',
  });
  controller.init();
  submit();
  expect(getPaper).toHaveBeenCalledTimes(2);
});

test('blocks ineligible paper', () => {
  const { view, submit } = createViewStub();
  const mocks = createMocks({
    assignmentStorage: {
      getPaper: jest.fn(() => ({ id: 'paper_2', title: 'Paper', status: 'Withdrawn', assignedRefereeEmails: [], assignmentVersion: 0 })),
    },
  });
  const controller = createRefereeAssignmentController({
    view,
    assignmentStorage: mocks.assignmentStorage,
    notificationService: mocks.notificationService,
    assignmentErrorLog: mocks.assignmentErrorLog,
    sessionState: mocks.sessionState,
    paperId: 'paper_2',
  });
  controller.init();
  submit();
  expect(view.setStatus).toHaveBeenCalledWith('Paper is not eligible for assignment.', true);
});

test('shows validation errors for duplicates and count', () => {
  const { view, submit } = createViewStub();
  view.getRefereeEmails = jest.fn(() => ['dup@example.com', 'dup@example.com', 'c@example.com']);
  const mocks = createMocks();
  const controller = createRefereeAssignmentController({
    view,
    assignmentStorage: mocks.assignmentStorage,
    notificationService: mocks.notificationService,
    assignmentErrorLog: mocks.assignmentErrorLog,
    sessionState: mocks.sessionState,
    paperId: 'paper_1',
  });
  controller.init();
  submit();
  expect(view.setFieldError).toHaveBeenCalled();
  expect(view.setCountError).toHaveBeenCalledWith('Exactly 3 referees are required.');
});

test('falls back to empty assigned referee list when missing', () => {
  const { view, submit } = createViewStub();
  const saveAssignments = jest.fn(() => ({
    id: 'paper_1',
    title: 'Paper',
    status: 'Submitted',
    assignedRefereeEmails: ['a@example.com', 'b@example.com', 'c@example.com'],
    assignmentVersion: 1,
  }));
  const mocks = createMocks({
    assignmentStorage: {
      getPaper: jest.fn(() => ({
        id: 'paper_1',
        title: 'Paper',
        status: 'Submitted',
        assignedRefereeEmails: null,
        assignmentVersion: 0,
      })),
      saveAssignments,
    },
  });
  const controller = createRefereeAssignmentController({
    view,
    assignmentStorage: mocks.assignmentStorage,
    notificationService: mocks.notificationService,
    assignmentErrorLog: mocks.assignmentErrorLog,
    sessionState: mocks.sessionState,
    paperId: 'paper_1',
  });
  controller.init();
  submit();
  expect(saveAssignments).toHaveBeenCalled();
});

test('handles concurrent change on save', () => {
  const { view, submit } = createViewStub();
  const mocks = createMocks({
    assignmentStorage: {
      getPaper: jest.fn(() => ({ id: 'paper_1', title: 'Paper', status: 'Submitted', assignedRefereeEmails: [], assignmentVersion: 0 })),
      saveAssignments: jest.fn(() => {
        throw new Error('concurrent_change');
      }),
    },
  });
  const controller = createRefereeAssignmentController({
    view,
    assignmentStorage: mocks.assignmentStorage,
    notificationService: mocks.notificationService,
    assignmentErrorLog: mocks.assignmentErrorLog,
    sessionState: mocks.sessionState,
    paperId: 'paper_1',
  });
  controller.init();
  submit();
  expect(view.setStatus).toHaveBeenCalledWith('Assignment changed. Refresh this paper to continue.', true);
});

test('uses unknown error type when save throws without message', () => {
  const { view, submit } = createViewStub();
  const mocks = createMocks({
    assignmentStorage: {
      getPaper: jest.fn(() => ({ id: 'paper_1', title: 'Paper', status: 'Submitted', assignedRefereeEmails: [], assignmentVersion: 0 })),
      saveAssignments: jest.fn(() => {
        throw {};
      }),
    },
  });
  const controller = createRefereeAssignmentController({
    view,
    assignmentStorage: mocks.assignmentStorage,
    notificationService: mocks.notificationService,
    assignmentErrorLog: mocks.assignmentErrorLog,
    sessionState: mocks.sessionState,
    paperId: 'paper_1',
  });
  controller.init();
  submit();
  expect(mocks.assignmentErrorLog.logFailure).toHaveBeenCalledWith({
    errorType: 'unknown',
    message: 'assignment_save_failed',
    context: 'paper_1',
  });
});

test('handles ineligible paper error on save', () => {
  const { view, submit } = createViewStub();
  const mocks = createMocks({
    assignmentStorage: {
      getPaper: jest.fn(() => ({ id: 'paper_1', title: 'Paper', status: 'Submitted', assignedRefereeEmails: [], assignmentVersion: 0 })),
      saveAssignments: jest.fn(() => {
        throw new Error('paper_ineligible');
      }),
    },
  });
  const controller = createRefereeAssignmentController({
    view,
    assignmentStorage: mocks.assignmentStorage,
    notificationService: mocks.notificationService,
    assignmentErrorLog: mocks.assignmentErrorLog,
    sessionState: mocks.sessionState,
    paperId: 'paper_1',
  });
  controller.init();
  submit();
  expect(view.setStatus).toHaveBeenCalledWith('Paper is not eligible for assignment.', true);
});

test('handles unknown save error as unavailable', () => {
  const { view, submit } = createViewStub();
  const mocks = createMocks({
    assignmentStorage: {
      getPaper: jest.fn(() => ({ id: 'paper_1', title: 'Paper', status: 'Submitted', assignedRefereeEmails: [], assignmentVersion: 0 })),
      saveAssignments: jest.fn(() => {
        throw new Error('unexpected');
      }),
    },
  });
  const controller = createRefereeAssignmentController({
    view,
    assignmentStorage: mocks.assignmentStorage,
    notificationService: mocks.notificationService,
    assignmentErrorLog: mocks.assignmentErrorLog,
    sessionState: mocks.sessionState,
    paperId: 'paper_1',
  });
  controller.init();
  submit();
  expect(view.setStatus).toHaveBeenCalledWith('Assignment is temporarily unavailable. Try again later.', true);
});

test('handles save error without error logger', () => {
  const { view, submit } = createViewStub();
  const mocks = createMocks({
    assignmentStorage: {
      getPaper: jest.fn(() => ({ id: 'paper_1', title: 'Paper', status: 'Submitted', assignedRefereeEmails: [], assignmentVersion: 0 })),
      saveAssignments: jest.fn(() => {
        throw new Error('concurrent_change');
      }),
    },
  });
  const controller = createRefereeAssignmentController({
    view,
    assignmentStorage: mocks.assignmentStorage,
    notificationService: mocks.notificationService,
    assignmentErrorLog: null,
    sessionState: mocks.sessionState,
    paperId: 'paper_1',
  });
  controller.init();
  submit();
  expect(view.setStatus).toHaveBeenCalledWith('Assignment changed. Refresh this paper to continue.', true);
});

test('logs notification failures and shows warning', () => {
  const { view, submit } = createViewStub();
  const mocks = createMocks({
    notificationService: { sendNotifications: jest.fn(() => ({ ok: false, failures: ['a@example.com'] })) },
  });
  const controller = createRefereeAssignmentController({
    view,
    assignmentStorage: mocks.assignmentStorage,
    notificationService: mocks.notificationService,
    assignmentErrorLog: mocks.assignmentErrorLog,
    sessionState: mocks.sessionState,
    paperId: 'paper_1',
  });
  controller.init();
  submit();
  expect(view.setWarning).toHaveBeenCalledWith('Notifications failed to send to all referees.');
  expect(mocks.assignmentErrorLog.logFailure).toHaveBeenCalled();
});

test('handles notification failure without error logger', () => {
  const { view, submit } = createViewStub();
  const mocks = createMocks({
    notificationService: { sendNotifications: jest.fn(() => ({ ok: false, failures: ['a@example.com'] })) },
  });
  const controller = createRefereeAssignmentController({
    view,
    assignmentStorage: mocks.assignmentStorage,
    notificationService: mocks.notificationService,
    assignmentErrorLog: null,
    sessionState: mocks.sessionState,
    paperId: 'paper_1',
  });
  controller.init();
  submit();
  expect(view.setWarning).toHaveBeenCalledWith('Notifications failed to send to all referees.');
});

test('succeeds and shows confirmation', () => {
  const { view, submit } = createViewStub();
  const mocks = createMocks();
  const controller = createRefereeAssignmentController({
    view,
    assignmentStorage: mocks.assignmentStorage,
    notificationService: mocks.notificationService,
    assignmentErrorLog: mocks.assignmentErrorLog,
    sessionState: mocks.sessionState,
    paperId: 'paper_1',
  });
  controller.init();
  submit();
  expect(view.showConfirmation).toHaveBeenCalledWith('paper_1', ['a@example.com', 'b@example.com', 'c@example.com']);
});
