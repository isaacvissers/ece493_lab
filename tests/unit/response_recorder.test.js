import { responseRecorder } from '../../src/services/response-recorder.js';
import { invitationStore } from '../../src/services/invitation-store.js';
import { assignmentStore } from '../../src/services/assignment-store.js';
import { createReviewInvitation } from '../../src/models/review_invitation.js';

beforeEach(() => {
  invitationStore.reset();
  assignmentStore.reset();
});

test('records accepted response and creates assignment', () => {
  const invitation = createReviewInvitation({ paperId: 'paper_1', reviewerEmail: 'reviewer@example.com' });
  invitationStore.addInvitation(invitation);
  const result = responseRecorder.recordResponse({ invitationId: invitation.invitationId, decision: 'accept' });
  expect(result.ok).toBe(true);
  const updated = invitationStore.getInvitation(invitation.invitationId);
  expect(updated.status).toBe('accepted');
  expect(assignmentStore.getAssignments()).toHaveLength(1);
});

test('records rejected response', () => {
  const invitation = createReviewInvitation({ paperId: 'paper_2', reviewerEmail: 'reviewer@example.com' });
  invitationStore.addInvitation(invitation);
  const result = responseRecorder.recordResponse({ invitationId: invitation.invitationId, decision: 'reject' });
  expect(result.ok).toBe(true);
  const updated = invitationStore.getInvitation(invitation.invitationId);
  expect(updated.status).toBe('rejected');
});

test('rejects invalid decision', () => {
  const result = responseRecorder.recordResponse({ invitationId: 'inv_1', decision: 'maybe' });
  expect(result.reason).toBe('invalid_decision');
});

test('defaults to invalid decision when no args provided', () => {
  const result = responseRecorder.recordResponse();
  expect(result.reason).toBe('invalid_decision');
});

test('rejects duplicate responses', () => {
  const invitation = createReviewInvitation({ paperId: 'paper_3', reviewerEmail: 'reviewer@example.com', status: 'accepted' });
  invitationStore.addInvitation(invitation);
  const result = responseRecorder.recordResponse({ invitationId: invitation.invitationId, decision: 'accept' });
  expect(result.reason).toBe('duplicate_response');
});

test('fails safely on validation failure', () => {
  const invitation = createReviewInvitation({ paperId: 'paper_4', reviewerEmail: 'reviewer@example.com' });
  invitationStore.addInvitation(invitation);
  invitationStore.setLookupFailureMode(true);
  const result = responseRecorder.recordResponse({ invitationId: invitation.invitationId, decision: 'accept' });
  expect(result.reason).toBe('record_failed');
  invitationStore.setLookupFailureMode(false);
});

test('rolls back invitation on assignment failure', () => {
  const invitation = createReviewInvitation({ paperId: 'paper_5', reviewerEmail: 'reviewer@example.com' });
  invitationStore.addInvitation(invitation);
  assignmentStore.setSaveFailureMode(true);
  const result = responseRecorder.recordResponse({ invitationId: invitation.invitationId, decision: 'accept' });
  expect(result.ok).toBe(false);
  const updated = invitationStore.getInvitation(invitation.invitationId);
  expect(updated.status).toBe('pending');
  assignmentStore.setSaveFailureMode(false);
});

test('handles assignment failure without message', () => {
  const invitation = createReviewInvitation({ paperId: 'paper_6', reviewerEmail: 'reviewer@example.com' });
  invitationStore.addInvitation(invitation);
  const original = assignmentStore.addAssignment;
  assignmentStore.addAssignment = () => {
    throw {};
  };
  const result = responseRecorder.recordResponse({ invitationId: invitation.invitationId, decision: 'accept' });
  expect(result.reason).toBe('record_failed');
  assignmentStore.addAssignment = original;
});
