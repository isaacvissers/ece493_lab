import { invitationService } from '../../src/services/invitation-service.js';
import { invitationStore } from '../../src/services/invitation-store.js';
import { invitationEmail } from '../../src/services/invitation-email.js';
import { invitationLog } from '../../src/services/invitation-log.js';

beforeEach(() => {
  invitationStore.reset();
  invitationEmail.clear();
  invitationLog.clear();
});

test('sends invitation and stores it', () => {
  const result = invitationService.sendInvitation({
    paperId: 'paper_1',
    reviewerEmail: 'reviewer@example.com',
    paperTitle: 'Paper One',
  });
  expect(result.ok).toBe(true);
  expect(invitationStore.getInvitations()).toHaveLength(1);
  expect(invitationEmail.getSent()).toHaveLength(1);
});

test('handles send failure', () => {
  invitationEmail.setFailureMode(true);
  const result = invitationService.sendInvitation({
    paperId: 'paper_2',
    reviewerEmail: 'reviewer@example.com',
    paperTitle: 'Paper Two',
  });
  expect(result.ok).toBe(false);
  expect(invitationLog.getFailures()).toHaveLength(1);
});

test('resends invitation', () => {
  const first = invitationService.sendInvitation({
    paperId: 'paper_3',
    reviewerEmail: 'reviewer@example.com',
    paperTitle: 'Paper Three',
  });
  const resent = invitationService.resendInvitation({
    invitationId: first.invitation.invitationId,
    paperTitle: 'Paper Three',
  });
  expect(resent.ok).toBe(true);
  expect(invitationEmail.getSent()).toHaveLength(2);
});

test('sendInvitation handles store failure', () => {
  invitationStore.setSaveFailureMode(true);
  const result = invitationService.sendInvitation({
    paperId: 'paper_fail',
    reviewerEmail: 'reviewer@example.com',
  });
  expect(result.reason).toBe('invitation_store_failed');
  invitationStore.setSaveFailureMode(false);
});

test('sendInvitation uses defaults when no options provided', () => {
  const result = invitationService.sendInvitation();
  expect(result.ok).toBe(true);
  expect(invitationStore.getInvitations()).toHaveLength(1);
});

test('resendInvitation returns not_found for missing invitation', () => {
  const result = invitationService.resendInvitation({ invitationId: 'missing' });
  expect(result.reason).toBe('not_found');
});

test('resendInvitation defaults to not_found when no args provided', () => {
  const result = invitationService.resendInvitation();
  expect(result.reason).toBe('not_found');
});

test('resendInvitation handles update failure', () => {
  const first = invitationService.sendInvitation({
    paperId: 'paper_4',
    reviewerEmail: 'reviewer@example.com',
  });
  invitationStore.setSaveFailureMode(true);
  const result = invitationService.resendInvitation({ invitationId: first.invitation.invitationId });
  expect(result.reason).toBe('invitation_store_failed');
  invitationStore.setSaveFailureMode(false);
});

test('resendInvitation logs send failure', () => {
  const first = invitationService.sendInvitation({
    paperId: 'paper_5',
    reviewerEmail: 'reviewer@example.com',
  });
  invitationEmail.setFailureMode(true);
  const result = invitationService.resendInvitation({ invitationId: first.invitation.invitationId });
  expect(result.reason).toBe('send_failed');
  expect(invitationLog.getFailures()).toHaveLength(1);
});

test('sendInvitation skips logging when logger is missing', () => {
  invitationEmail.setFailureMode(true);
  const result = invitationService.sendInvitation({
    paperId: 'paper_6',
    reviewerEmail: 'reviewer@example.com',
    invitationLog: null,
  });
  expect(result.reason).toBe('send_failed');
  expect(invitationLog.getFailures()).toHaveLength(0);
});

test('resendInvitation skips logging when logger is missing', () => {
  const first = invitationService.sendInvitation({
    paperId: 'paper_7',
    reviewerEmail: 'reviewer@example.com',
  });
  invitationEmail.setFailureMode(true);
  const result = invitationService.resendInvitation({
    invitationId: first.invitation.invitationId,
    invitationLog: null,
  });
  expect(result.reason).toBe('send_failed');
  expect(invitationLog.getFailures()).toHaveLength(0);
});

test('recordResponse logs record failures', () => {
  const result = invitationService.recordResponse({
    invitationId: 'inv_missing',
    decision: 'accept',
    responseRecorder: { recordResponse: () => ({ ok: false, reason: 'record_failed' }) },
  });
  expect(result.reason).toBe('record_failed');
  expect(invitationLog.getFailures()).toHaveLength(1);
});

test('recordResponse skips logging when logger is missing', () => {
  const result = invitationService.recordResponse({
    invitationId: 'inv_missing',
    decision: 'accept',
    responseRecorder: { recordResponse: () => ({ ok: false, reason: 'invitation_store_failed' }) },
    invitationLog: null,
  });
  expect(result.reason).toBe('invitation_store_failed');
});

test('recordResponse does not log on success', () => {
  const result = invitationService.recordResponse({
    invitationId: 'inv_ok',
    decision: 'accept',
    responseRecorder: { recordResponse: () => ({ ok: true }) },
  });
  expect(result.ok).toBe(true);
});

test('recordResponse defaults to invalid decision when no args provided', () => {
  const result = invitationService.recordResponse();
  expect(result.reason).toBe('invalid_decision');
});
