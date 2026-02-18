import { invitationEmail } from '../../src/services/invitation-email.js';

beforeEach(() => {
  invitationEmail.clear();
});

test('sends invitation email with links', () => {
  const result = invitationEmail.sendInvitation({
    invitation: { invitationId: 'inv_1', reviewerEmail: 'reviewer@example.com', paperId: 'paper_1' },
    paper: { id: 'paper_1', title: 'Paper One' },
  });
  expect(result.ok).toBe(true);
  expect(result.email.body).toContain('Accept');
  expect(invitationEmail.getSent()).toHaveLength(1);
});

test('uses default paper details and base url when missing', () => {
  const result = invitationEmail.sendInvitation({
    invitation: { invitationId: 'inv_2', reviewerEmail: 'reviewer@example.com', paperId: 'paper_2' },
    paper: { id: 'paper_2', title: null, baseUrl: 'https://example.com/invite' },
  });
  expect(result.ok).toBe(true);
  expect(result.email.body).toContain('paper_2');
  expect(result.email.body).toContain('https://example.com/invite');
});

test('uses invitation details when paper is missing', () => {
  const result = invitationEmail.sendInvitation({
    invitation: { invitationId: 'inv_3', reviewerEmail: 'reviewer@example.com', paperId: 'paper_3' },
  });
  expect(result.ok).toBe(true);
  expect(result.email.subject).toContain('paper_3');
});

test('handles failure mode', () => {
  invitationEmail.setFailureMode(true);
  const result = invitationEmail.sendInvitation({
    invitation: { invitationId: 'inv_2', reviewerEmail: 'reviewer@example.com', paperId: 'paper_2' },
    paper: { id: 'paper_2', title: 'Paper Two' },
  });
  expect(result.ok).toBe(false);
});

test('throws when invitation is missing', () => {
  expect(() => invitationEmail.sendInvitation()).toThrow();
});
