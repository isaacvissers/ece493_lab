import { refereeCount as defaultRefereeCount } from './referee-count.js';
import { refereeInvitationCheck as defaultInvitationCheck } from './referee-invitation-check.js';
import { readinessAudit as defaultReadinessAudit } from './readiness-audit.js';
import { errorLog as defaultErrorLog } from './error-log.js';

function buildResult({ ok, ready, count, reason, missingInvitations }) {
  return {
    ok,
    ready,
    count,
    reason,
    missingInvitations,
  };
}

export const refereeReadiness = {
  evaluate({
    paperId,
    refereeCount = defaultRefereeCount,
    invitationCheck = defaultInvitationCheck,
    readinessAudit = defaultReadinessAudit,
    errorLog = defaultErrorLog,
    assignmentStorage,
    reviewRequestStore,
  } = {}) {
    let count = null;
    try {
      count = refereeCount.getCount({ paperId, assignmentStorage, reviewRequestStore });
    } catch (error) {
      if (errorLog) {
        errorLog.logFailure({
          errorType: 'readiness_count_failure',
          message: error && error.message ? error.message : 'count_failure',
          context: paperId,
        });
      }
      if (readinessAudit) {
        readinessAudit.record({
          paperId,
          result: 'error',
          count: null,
          reason: 'count_failure',
        });
      }
      return buildResult({ ok: false, ready: false, count: null, reason: 'count_failure', missingInvitations: [] });
    }

    if (count === 3) {
      const missingInvitations = invitationCheck
        ? invitationCheck.getMissingInvitations({ paperId, assignmentStorage, reviewRequestStore })
        : [];
      if (readinessAudit) {
        readinessAudit.record({
          paperId,
          result: 'ready',
          count,
          reason: 'count_ok',
        });
      }
      return buildResult({ ok: true, ready: true, count, reason: 'count_ok', missingInvitations });
    }

    const reason = count < 3 ? 'count_low' : 'count_high';
    if (readinessAudit) {
      readinessAudit.record({
        paperId,
        result: 'blocked',
        count,
        reason,
      });
    }
    return buildResult({ ok: true, ready: false, count, reason, missingInvitations: [] });
  },
};
