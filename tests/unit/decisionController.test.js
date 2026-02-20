import { createDecisionEntryView } from '../../src/views/decisionEntryView.js';
import { createDecisionController } from '../../src/controllers/decisionController.js';
import { decisionEligibilityService } from '../../src/services/decisionEligibilityService.js';
import { decisionService } from '../../src/services/decisionService.js';
import { assignmentStorage } from '../../src/services/assignment-storage.js';
import { sessionState } from '../../src/models/session-state.js';
import { auditLogService } from '../../src/services/audit-log-service.js';
import { authorNotificationService } from '../../src/services/authorNotificationService.js';
import { jest } from '@jest/globals';

function seedReviews(entries) {
  localStorage.setItem('cms.submitted_reviews', JSON.stringify(entries));
}

beforeEach(() => {
  assignmentStorage.reset();
  decisionService.reset();
  authorNotificationService.reset();
  auditLogService.reset();
  sessionState.clear();
  document.body.innerHTML = '';
  localStorage.removeItem('cms.submitted_reviews');
});

test('blocks submission when session is missing', () => {
  assignmentStorage.seedPaper({ id: 'paper_auth', title: 'Paper', status: 'submitted', editorId: 'editor_1' });
  seedReviews([
    { paperId: 'paper_auth', status: 'submitted' },
    { paperId: 'paper_auth', status: 'submitted' },
    { paperId: 'paper_auth', status: 'submitted' },
  ]);

  const view = createDecisionEntryView();
  document.body.appendChild(view.element);
  const controller = createDecisionController({
    view,
    paperId: 'paper_auth',
    sessionState,
    assignmentStorage,
    decisionEligibilityService,
    decisionService,
    auditLogService,
    authorNotificationService,
  });
  controller.init();

  view.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  expect(view.element.querySelector('#decision-banner').textContent).toContain('Session expired');
});

test('prompts when decision selection is missing', () => {
  assignmentStorage.seedPaper({ id: 'paper_select', title: 'Paper', status: 'submitted', editorId: 'editor_1' });
  seedReviews([
    { paperId: 'paper_select', status: 'submitted' },
    { paperId: 'paper_select', status: 'submitted' },
    { paperId: 'paper_select', status: 'submitted' },
  ]);
  sessionState.authenticate({ id: 'editor_1', email: 'editor@example.com', role: 'Editor', createdAt: new Date().toISOString() });

  const view = createDecisionEntryView();
  document.body.appendChild(view.element);
  const controller = createDecisionController({
    view,
    paperId: 'paper_select',
    sessionState,
    assignmentStorage,
    decisionEligibilityService,
    decisionService,
    auditLogService,
    authorNotificationService,
  });
  controller.init();

  view.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  expect(view.element.querySelector('#decision-banner').textContent).toContain('select accept or reject');
});

test('reports invalid review count on submit', () => {
  assignmentStorage.seedPaper({ id: 'paper_count', title: 'Paper', status: 'submitted', editorId: 'editor_1' });
  seedReviews([
    { paperId: 'paper_count', status: 'submitted' },
    { paperId: 'paper_count', status: 'submitted' },
  ]);
  sessionState.authenticate({ id: 'editor_1', email: 'editor@example.com', role: 'Editor', createdAt: new Date().toISOString() });

  const view = createDecisionEntryView();
  document.body.appendChild(view.element);
  const controller = createDecisionController({
    view,
    paperId: 'paper_count',
    sessionState,
    assignmentStorage,
    decisionEligibilityService,
    decisionService,
    auditLogService,
    authorNotificationService,
  });
  controller.init();

  view.element.querySelector('#decision-accept').checked = true;
  view.element.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

  const banner = view.element.querySelector('#decision-banner').textContent;
  expect(banner).toContain('Current: 2');
  expect(view.element.querySelector('#decision-submit').disabled).toBe(true);
});

test('init tolerates missing view hooks', () => {
  assignmentStorage.seedPaper({ id: 'paper_stub', title: 'Paper', status: 'submitted', editorId: 'editor_1' });
  seedReviews([
    { paperId: 'paper_stub', status: 'submitted' },
    { paperId: 'paper_stub', status: 'submitted' },
    { paperId: 'paper_stub', status: 'submitted' },
  ]);

  const view = {
    setStatus: jest.fn(),
    setSubmitDisabled: jest.fn(),
    onSubmit: jest.fn(),
    getSelection: jest.fn(() => 'accept'),
    getComments: jest.fn(() => ''),
  };

  const controller = createDecisionController({
    view,
    paperId: 'paper_stub',
    sessionState,
    assignmentStorage,
    decisionEligibilityService,
    decisionService,
    auditLogService,
    authorNotificationService,
  });

  controller.init();
  expect(view.setSubmitDisabled).toHaveBeenCalled();
});

test('init exits when view is missing', () => {
  const controller = createDecisionController({
    view: null,
    paperId: 'paper_none',
    sessionState,
    assignmentStorage,
    decisionEligibilityService,
    decisionService,
    auditLogService,
    authorNotificationService,
  });

  expect(() => controller.init()).not.toThrow();
});

test('init uses defaults when optional hooks are missing', () => {
  const view = {
    setStatus: jest.fn(),
    setReviews: jest.fn(),
    getSelection: jest.fn(() => 'accept'),
    onSubmit: jest.fn(),
  };

  const controller = createDecisionController({
    view,
    paperId: 'paper_defaults',
    sessionState,
  });

  controller.init();
  expect(view.setStatus).toHaveBeenCalled();
});

test('auth failure skips status when view lacks handler', () => {
  assignmentStorage.seedPaper({ id: 'paper_auth_skip', title: 'Paper', status: 'submitted', editorId: 'editor_1' });
  seedReviews([
    { paperId: 'paper_auth_skip', status: 'submitted' },
    { paperId: 'paper_auth_skip', status: 'submitted' },
    { paperId: 'paper_auth_skip', status: 'submitted' },
  ]);

  const view = { getSelection: jest.fn(() => ''), onSubmit: jest.fn() };

  const controller = createDecisionController({
    view,
    paperId: 'paper_auth_skip',
    sessionState,
    assignmentStorage,
    decisionEligibilityService,
    decisionService,
    auditLogService,
    authorNotificationService,
    authController: null,
  });
  controller.init();
  const handler = view.onSubmit.mock.calls[0][0];
  handler({ preventDefault: () => {} });
  expect(view.onSubmit).toHaveBeenCalled();
});

test('handles validation failure when status hook is absent', () => {
  const view = {
    getSelection: jest.fn(() => ''),
    onSubmit: jest.fn(),
  };
  const sessionStub = {
    isAuthenticated: () => true,
  };

  const controller = createDecisionController({
    view,
    paperId: 'paper_validate',
    sessionState: sessionStub,
  });
  controller.init();
  const handler = view.onSubmit.mock.calls[0][0];
  handler({ preventDefault: () => {} });
  expect(view.getSelection).toHaveBeenCalled();
});

test('uses fallback comment when view lacks comments', () => {
  const view = {
    getSelection: jest.fn(() => 'accept'),
    setStatus: jest.fn(),
    onSubmit: jest.fn(),
  };
  const sessionStub = {
    isAuthenticated: () => true,
    getCurrentUser: () => ({ id: 'editor_stub' }),
  };
  const decisionServiceStub = {
    saveDecision: jest.fn(() => ({ ok: false, reason: 'save_failed' })),
  };

  const controller = createDecisionController({
    view,
    paperId: 'paper_comment',
    sessionState: sessionStub,
    decisionService: decisionServiceStub,
  });
  controller.init();
  const handler = view.onSubmit.mock.calls[0][0];
  handler({ preventDefault: () => {} });
  expect(decisionServiceStub.saveDecision).toHaveBeenCalled();
  expect(view.setStatus).toHaveBeenCalled();
});

test('supports sessions without current user detail', () => {
  const view = {
    getSelection: jest.fn(() => 'accept'),
    setStatus: jest.fn(),
    onSubmit: jest.fn(),
    getComments: jest.fn(() => ''),
  };
  const sessionStub = {
    isAuthenticated: () => true,
  };
  const decisionServiceStub = {
    saveDecision: jest.fn(() => ({ ok: true })),
  };

  const controller = createDecisionController({
    view,
    paperId: 'paper_userless',
    sessionState: sessionStub,
    decisionService: decisionServiceStub,
  });
  controller.init();
  const handler = view.onSubmit.mock.calls[0][0];
  handler({ preventDefault: () => {} });
  expect(decisionServiceStub.saveDecision).toHaveBeenCalledWith(expect.objectContaining({ editorId: null }));
});

test('skips status update when save fails and view lacks handler', () => {
  const view = {
    getSelection: jest.fn(() => 'accept'),
    onSubmit: jest.fn(),
  };
  const sessionStub = {
    isAuthenticated: () => true,
    getCurrentUser: () => ({ id: 'editor_skip' }),
  };
  const decisionServiceStub = {
    saveDecision: jest.fn(() => ({ ok: false, reason: 'save_failed' })),
  };

  const controller = createDecisionController({
    view,
    paperId: 'paper_fail_status',
    sessionState: sessionStub,
    decisionService: decisionServiceStub,
  });
  controller.init();
  const handler = view.onSubmit.mock.calls[0][0];
  handler({ preventDefault: () => {} });
  expect(decisionServiceStub.saveDecision).toHaveBeenCalled();
});

test('skips status update when save succeeds and view lacks handler', () => {
  const view = {
    getSelection: jest.fn(() => 'accept'),
    onSubmit: jest.fn(),
  };
  const sessionStub = {
    isAuthenticated: () => true,
    getCurrentUser: () => ({ id: 'editor_skip_ok' }),
  };
  const decisionServiceStub = {
    saveDecision: jest.fn(() => ({ ok: true })),
  };

  const controller = createDecisionController({
    view,
    paperId: 'paper_success_status',
    sessionState: sessionStub,
    decisionService: decisionServiceStub,
  });
  controller.init();
  const handler = view.onSubmit.mock.calls[0][0];
  handler({ preventDefault: () => {} });
  expect(decisionServiceStub.saveDecision).toHaveBeenCalled();
});

test('init skips submission binding when handler is missing', () => {
  const view = {
    setStatus: jest.fn(),
    setReviews: jest.fn(),
  };
  const controller = createDecisionController({
    view,
    paperId: 'paper_no_submit',
    sessionState,
  });
  controller.init();
  expect(view.setStatus).toHaveBeenCalled();
});

test('controller init tolerates missing arguments', () => {
  const controller = createDecisionController();
  expect(() => controller.init()).not.toThrow();
});
