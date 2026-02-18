import { validationService } from '../services/validation-service.js';
import {
  REFEREE_ASSIGNMENT_STATUS,
  NON_DECLINED_REFEREE_STATUSES,
} from './referee-assignment-status.js';

function generateAssignmentId() {
  return `ref_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export function normalizeRefereeEmail(email) {
  return (email || '').trim().toLowerCase();
}

export function createRefereeAssignment({
  assignmentId = null,
  paperId,
  refereeEmail,
  status = REFEREE_ASSIGNMENT_STATUS.pending,
  createdAt = null,
  updatedAt = null,
} = {}) {
  const timestamp = createdAt || new Date().toISOString();
  return {
    assignmentId: assignmentId || generateAssignmentId(),
    paperId,
    refereeEmail: normalizeRefereeEmail(refereeEmail),
    status,
    createdAt: timestamp,
    updatedAt: updatedAt || timestamp,
  };
}

export function isNonDeclinedRefereeAssignment(assignment) {
  if (!assignment) {
    return false;
  }
  return NON_DECLINED_REFEREE_STATUSES.includes(assignment.status);
}

export function validateRefereeEmails(rawEmails, existingEmails = []) {
  const blanks = [];
  const invalid = [];
  const duplicates = [];
  const uniqueEmails = [];
  const seen = new Set(existingEmails.map(normalizeRefereeEmail));

  rawEmails.forEach((raw, index) => {
    const trimmed = (raw || '').trim();
    if (!trimmed) {
      blanks.push(index);
      return;
    }
    if (!validationService.isEmailValid(trimmed)) {
      invalid.push(index);
      return;
    }
    const normalized = normalizeRefereeEmail(trimmed);
    if (seen.has(normalized)) {
      duplicates.push(index);
      return;
    }
    seen.add(normalized);
    uniqueEmails.push(normalized);
  });

  return {
    ok: blanks.length === 0 && invalid.length === 0 && duplicates.length === 0 && uniqueEmails.length === 3,
    blanks,
    invalid,
    duplicates,
    uniqueEmails,
  };
}
