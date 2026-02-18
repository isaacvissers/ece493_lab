import { normalizeReviewerEmail } from '../models/reviewer.js';

export const reviewerBatchAssign = {
  split({ reviewerEmails = [], currentCount = 0, max = 3 } = {}) {
    const normalized = reviewerEmails
      .map((email) => normalizeReviewerEmail(email))
      .filter((email) => email);
    const remaining = Math.max(max - currentCount, 0);
    const allowed = normalized.slice(0, remaining);
    const blocked = normalized.slice(remaining);
    return { allowed, blocked, remaining };
  },
};
