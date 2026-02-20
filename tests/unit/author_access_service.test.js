import { jest } from '@jest/globals';
import { authorAccessService } from '../../src/services/author_access_service.js';
import { scheduleRepository } from '../../src/services/schedule_repository.js';
import { auditLogService } from '../../src/services/audit_log_service.js';

beforeEach(() => {
  scheduleRepository.reset();
  auditLogService.reset();
});

test('returns accepted papers for matching author', () => {
  scheduleRepository.savePapers([
    { paperId: 'paper_ok', status: 'accepted', authorIds: ['author_ok'], conferenceId: 'conf_ok' },
    { paperId: 'paper_other', status: 'accepted', authorIds: ['author_other'], conferenceId: 'conf_ok' },
  ]);
  const result = authorAccessService.getAcceptedPapersForAuthor({
    authorId: 'author_ok',
    conferenceId: 'conf_ok',
  });
  expect(result.ok).toBe(true);
  expect(result.papers.map((paper) => paper.paperId)).toEqual(['paper_ok']);
});

test('returns missing_author when authorId is not provided', () => {
  const result = authorAccessService.getAcceptedPapersForAuthor();
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('missing_author');
});

test('logs access denial when author not associated', () => {
  scheduleRepository.savePapers([
    { paperId: 'paper_denied', status: 'accepted', authorIds: ['author_real'], conferenceId: 'conf_denied' },
  ]);
  const result = authorAccessService.getAcceptedPapersForAuthor({
    authorId: 'author_fake',
    conferenceId: 'conf_denied',
    auditLogService,
  });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('access_denied');
  expect(auditLogService.getLogs()[0].eventType).toBe('schedule_access_denied');
});

test('falls back to audit log when helper missing', () => {
  scheduleRepository.savePapers([
    { paperId: 'paper_fallback', status: 'accepted', authorIds: ['author_real'], conferenceId: 'conf_fallback' },
  ]);
  const auditLogStub = { log: jest.fn() };
  const result = authorAccessService.getAcceptedPapersForAuthor({
    authorId: 'author_fake',
    conferenceId: 'conf_fallback',
    auditLogService: auditLogStub,
  });
  expect(result.ok).toBe(false);
  expect(auditLogStub.log).toHaveBeenCalled();
});

test('uses schedule fallback when conferenceId missing', () => {
  scheduleRepository.savePapers([
    { paperId: 'paper_default', status: 'accepted', authorIds: ['author_real'] },
  ]);
  const auditLogStub = { log: jest.fn() };
  const result = authorAccessService.getAcceptedPapersForAuthor({
    authorId: 'author_fake',
    auditLogService: auditLogStub,
  });
  expect(result.ok).toBe(false);
  const call = auditLogStub.log.mock.calls[0][0];
  expect(call.relatedId).toBe('schedule');
});
test('returns access_denied without audit log service', () => {
  scheduleRepository.savePapers([
    { paperId: 'paper_no_log', status: 'accepted', authorIds: ['author_real'], conferenceId: 'conf_no_log' },
  ]);
  const result = authorAccessService.getAcceptedPapersForAuthor({
    authorId: 'author_fake',
    conferenceId: 'conf_no_log',
    auditLogService: null,
  });
  expect(result.ok).toBe(false);
  expect(result.reason).toBe('access_denied');
});

test('isAuthorForConference returns true when associated', () => {
  scheduleRepository.savePapers([
    { paperId: 'paper_assoc', status: 'accepted', authorIds: ['author_assoc'], conferenceId: 'conf_assoc' },
  ]);
  const result = authorAccessService.isAuthorForConference({
    authorId: 'author_assoc',
    conferenceId: 'conf_assoc',
  });
  expect(result).toBe(true);
});

test('isAuthorForConference returns false when not associated', () => {
  scheduleRepository.savePapers([
    { paperId: 'paper_assoc', status: 'accepted', authorIds: ['author_assoc'], conferenceId: 'conf_assoc' },
  ]);
  const result = authorAccessService.isAuthorForConference({
    authorId: 'author_other',
    conferenceId: 'conf_assoc',
  });
  expect(result).toBe(false);
});

test('isAuthorForConference handles missing args', () => {
  const result = authorAccessService.isAuthorForConference();
  expect(result).toBe(false);
});
