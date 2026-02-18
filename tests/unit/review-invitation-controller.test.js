import { jest } from '@jest/globals';
import { createReviewInvitationController } from '../../src/controllers/review-invitation-controller.js';

function createViewStub() {
  return {
    setStatus: jest.fn(),
    setDetail: jest.fn(),
    setActions: jest.fn(),
  };
}

test('renders success response', () => {
  const view = createViewStub();
  const controller = createReviewInvitationController({
    view,
    invitationId: 'inv_1',
    decision: 'accept',
    responseRecorder: { recordResponse: () => ({ ok: true }) },
  });
  controller.init();
  expect(view.setStatus).toHaveBeenCalledWith('Response recorded: accept.', false);
});

test('renders duplicate response error', () => {
  const view = createViewStub();
  const controller = createReviewInvitationController({
    view,
    invitationId: 'inv_2',
    decision: 'accept',
    responseRecorder: { recordResponse: () => ({ ok: false, reason: 'duplicate_response' }) },
  });
  controller.init();
  expect(view.setStatus).toHaveBeenCalledWith('Response already recorded.', true);
});

test('renders invalid link error', () => {
  const view = createViewStub();
  const controller = createReviewInvitationController({
    view,
    invitationId: 'inv_3',
    decision: 'accept',
    responseRecorder: { recordResponse: () => ({ ok: false, reason: 'expired' }) },
  });
  controller.init();
  expect(view.setStatus).toHaveBeenCalledWith('Invitation link is invalid or expired.', true);
});

test('renders invalid decision error', () => {
  const view = createViewStub();
  const controller = createReviewInvitationController({
    view,
    invitationId: 'inv_4',
    decision: 'maybe',
    responseRecorder: { recordResponse: () => ({ ok: false, reason: 'invalid_decision' }) },
  });
  controller.init();
  expect(view.setStatus).toHaveBeenCalledWith('Invalid response option.', true);
});

test('logs failure on record error', () => {
  const view = createViewStub();
  const logFailure = jest.fn();
  const controller = createReviewInvitationController({
    view,
    invitationId: 'inv_5',
    decision: 'accept',
    responseRecorder: { recordResponse: () => ({ ok: false, reason: 'record_failed' }) },
    invitationLog: { logFailure },
  });
  controller.init();
  expect(logFailure).toHaveBeenCalled();
});

test('handles record error without logger', () => {
  const view = createViewStub();
  const controller = createReviewInvitationController({
    view,
    invitationId: 'inv_6',
    decision: 'accept',
    responseRecorder: { recordResponse: () => ({ ok: false, reason: 'record_failed' }) },
    invitationLog: null,
  });
  controller.init();
  expect(view.setStatus).toHaveBeenCalledWith('Response could not be recorded. Please try again later.', true);
});

test('handles not found response', () => {
  const view = createViewStub();
  const controller = createReviewInvitationController({
    view,
    invitationId: 'inv_7',
    decision: 'accept',
    responseRecorder: { recordResponse: () => ({ ok: false, reason: 'not_found' }) },
  });
  controller.init();
  expect(view.setStatus).toHaveBeenCalledWith('Invitation link is invalid or expired.', true);
});

test('creates controller with defaults when called without args', () => {
  const controller = createReviewInvitationController();
  expect(typeof controller.init).toBe('function');
});
