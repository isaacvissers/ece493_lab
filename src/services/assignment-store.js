import { isActiveAssignment, isSameAssignment } from '../models/assignment.js';
import { normalizeReviewerEmail } from '../models/reviewer.js';

const ASSIGNMENTS_KEY = 'cms.reviewer_assignments';

let cachedAssignments = null;
let lookupFailure = false;
let saveFailure = false;

function loadAssignments() {
  if (lookupFailure) {
    throw new Error('lookup_failure');
  }
  if (cachedAssignments) {
    return cachedAssignments;
  }
  const raw = localStorage.getItem(ASSIGNMENTS_KEY);
  cachedAssignments = raw ? JSON.parse(raw) : [];
  return cachedAssignments;
}

function persistAssignments(assignments) {
  if (saveFailure) {
    throw new Error('save_failure');
  }
  localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(assignments));
  cachedAssignments = assignments;
}

function getActiveAssignmentsForReviewer(email) {
  const normalized = normalizeReviewerEmail(email);
  return loadAssignments().filter(
    (assignment) => isActiveAssignment(assignment) && assignment.reviewerEmail === normalized,
  );
}

export const assignmentStore = {
  setLookupFailureMode(enabled) {
    lookupFailure = Boolean(enabled);
  },
  setSaveFailureMode(enabled) {
    saveFailure = Boolean(enabled);
  },
  reset() {
    lookupFailure = false;
    saveFailure = false;
    cachedAssignments = null;
    localStorage.removeItem(ASSIGNMENTS_KEY);
  },
  getAssignments() {
    return loadAssignments().slice();
  },
  getActiveAssignmentsForReviewer(email) {
    return getActiveAssignmentsForReviewer(email).slice();
  },
  getActiveCountForReviewer(email) {
    return getActiveAssignmentsForReviewer(email).length;
  },
  hasActiveAssignment(paperId, reviewerEmail) {
    const normalized = normalizeReviewerEmail(reviewerEmail);
    return loadAssignments().some(
      (assignment) => isActiveAssignment(assignment) && isSameAssignment(assignment, paperId, normalized),
    );
  },
  addAssignment(assignment, { limit = 5 } = {}) {
    const normalized = normalizeReviewerEmail(assignment.reviewerEmail);
    const nextAssignment = { ...assignment, reviewerEmail: normalized };
    const assignments = loadAssignments().slice();
    const currentActiveCount = assignments.filter(
      (entry) => isActiveAssignment(entry) && entry.reviewerEmail === normalized,
    ).length;
    if (currentActiveCount >= limit) {
      throw new Error('limit_reached');
    }
    if (assignments.some(
      (entry) => isActiveAssignment(entry) && isSameAssignment(entry, nextAssignment.paperId, normalized),
    )) {
      throw new Error('duplicate_assignment');
    }
    assignments.push(nextAssignment);
    persistAssignments(assignments);
    return nextAssignment;
  },
  removeAssignments({ paperId, reviewerEmails } = {}) {
    const emails = Array.isArray(reviewerEmails) ? reviewerEmails.map(normalizeReviewerEmail) : [];
    const assignments = loadAssignments();
    const remaining = assignments.filter((entry) => (
      !isActiveAssignment(entry)
      || entry.paperId !== paperId
      || !emails.includes(entry.reviewerEmail)
    ));
    persistAssignments(remaining);
  },
};
