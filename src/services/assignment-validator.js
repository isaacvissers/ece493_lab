export const assignmentValidator = {
  validateLimit({ activeCount, limit = 5 } = {}) {
    if (typeof activeCount !== 'number' || Number.isNaN(activeCount)) {
      return { ok: false, reason: 'lookup_failed' };
    }
    if (activeCount >= limit) {
      return { ok: false, reason: 'limit_reached' };
    }
    return { ok: true };
  },
  validateUniqueAssignment({ alreadyAssigned } = {}) {
    if (alreadyAssigned) {
      return { ok: false, reason: 'already_assigned' };
    }
    return { ok: true };
  },
};
