import { validationService } from '../services/validation-service.js';

export function normalizeRefereeEmail(email) {
  return (email || '').trim().toLowerCase();
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
