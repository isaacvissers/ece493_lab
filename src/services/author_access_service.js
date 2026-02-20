import { scheduleRepository as defaultScheduleRepository } from './schedule_repository.js';
import { accessControl as defaultAccessControl } from './access_control.js';
import { auditLogService as defaultAuditLogService } from './audit_log_service.js';

export const authorAccessService = {
  getAcceptedPapersForAuthor({
    authorId,
    conferenceId,
    scheduleRepository = defaultScheduleRepository,
    accessControl = defaultAccessControl,
    auditLogService = defaultAuditLogService,
  } = {}) {
    if (!authorId) {
      return { ok: false, reason: 'missing_author', papers: [] };
    }
    const accepted = scheduleRepository.getAcceptedPapers(conferenceId);
    const papers = accepted.filter((paper) => accessControl.isAuthor({ paper, authorId }));
    if (!papers.length) {
      if (auditLogService) {
        if (auditLogService.logScheduleAccessDenied) {
          auditLogService.logScheduleAccessDenied({ conferenceId, authorId });
        } else {
          auditLogService.log({
            eventType: 'schedule_access_denied',
            relatedId: conferenceId || 'schedule',
            details: { authorId },
          });
        }
      }
      return { ok: false, reason: 'access_denied', papers: [] };
    }
    return { ok: true, papers };
  },
  isAuthorForConference({
    authorId,
    conferenceId,
    scheduleRepository = defaultScheduleRepository,
    accessControl = defaultAccessControl,
    auditLogService = defaultAuditLogService,
  } = {}) {
    const result = authorAccessService.getAcceptedPapersForAuthor({
      authorId,
      conferenceId,
      scheduleRepository,
      accessControl,
      auditLogService,
    });
    return result.ok;
  },
};
