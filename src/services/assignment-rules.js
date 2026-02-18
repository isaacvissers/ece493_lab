import { validationService } from './validation-service.js';
import { normalizeReviewerEmail } from '../models/reviewer.js';
import { createViolation } from '../models/violation.js';
import { assignmentStore as defaultAssignmentStore } from './assignment-store.js';

export const assignmentRules = {
  evaluate({ paperId, reviewerEmails, limit = 5, assignmentStore = defaultAssignmentStore } = {}) {
    const violations = [];
    const candidates = [];
    const seen = new Set();
    const emails = Array.isArray(reviewerEmails) ? reviewerEmails : [];

    emails.forEach((raw) => {
      const trimmed = (raw || '').trim();
      if (!trimmed) {
        return;
      }
      if (!validationService.isEmailValid(trimmed)) {
        violations.push(createViolation({
          reviewerEmail: trimmed,
          rule: 'invalid_email',
          message: 'Invalid reviewer email.',
        }));
        return;
      }

      const normalized = normalizeReviewerEmail(trimmed);
      if (seen.has(normalized)) {
        violations.push(createViolation({
          reviewerEmail: normalized,
          rule: 'duplicate_entry',
          message: 'Duplicate reviewer entry.',
        }));
        return;
      }
      seen.add(normalized);

      let alreadyAssigned = false;
      let activeCount = null;
      try {
        alreadyAssigned = assignmentStore.hasActiveAssignment(paperId, normalized);
        activeCount = assignmentStore.getActiveCountForReviewer(normalized);
      } catch (error) {
        throw new Error('evaluation_failed');
      }

      if (alreadyAssigned) {
        violations.push(createViolation({
          reviewerEmail: normalized,
          rule: 'duplicate_assignment',
          message: 'Reviewer is already assigned to this paper.',
        }));
        return;
      }

      if (typeof activeCount !== 'number' || Number.isNaN(activeCount)) {
        throw new Error('evaluation_failed');
      }

      if (activeCount >= limit) {
        violations.push(createViolation({
          reviewerEmail: normalized,
          rule: 'limit_reached',
          message: 'Reviewer has reached the maximum of 5 active assignments.',
        }));
        return;
      }

      candidates.push(normalized);
    });

    return { candidates, violations };
  },
  aggregate(violations = []) {
    const summary = new Map();
    violations.forEach((violation) => {
      if (!violation) {
        return;
      }
      const key = violation.reviewerEmail || 'unknown';
      if (!summary.has(key)) {
        summary.set(key, []);
      }
      summary.get(key).push(violation);
    });
    return Array.from(summary.entries()).map(([email, entries]) => ({ email, entries: entries.slice() }));
  },
};
