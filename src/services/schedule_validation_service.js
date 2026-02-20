function parseTimestamp(value) {
  if (!value) {
    return null;
  }
  let candidate = value;
  if (typeof value === 'string' && !value.endsWith('Z') && !/[+-]\d{2}:\d{2}$/.test(value)) {
    candidate = `${value}Z`;
  }
  const timestamp = Date.parse(candidate);
  if (Number.isNaN(timestamp)) {
    return null;
  }
  return timestamp;
}

function getConferenceWindow(conference) {
  if (!conference) {
    return { start: null, end: null };
  }
  const start = parseTimestamp(conference.timeWindowStart || (conference.dateRange && conference.dateRange.start));
  const end = parseTimestamp(conference.timeWindowEnd || (conference.dateRange && conference.dateRange.end));
  return { start, end };
}

function overlaps(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && aEnd > bStart;
}

export const scheduleValidationService = {
  validateEdit({
    entry,
    updates = {},
    entries = [],
    conference = null,
  } = {}) {
    if (!entry) {
      return { ok: false, reason: 'not_found' };
    }

    const nextEntry = {
      ...entry,
      ...updates,
    };

    if (!nextEntry.roomId || !nextEntry.startTime || !nextEntry.endTime) {
      return { ok: false, reason: 'unscheduled' };
    }

    const start = parseTimestamp(nextEntry.startTime);
    const end = parseTimestamp(nextEntry.endTime);
    if (!start || !end || start >= end) {
      return { ok: false, reason: 'invalid_time' };
    }

    const window = getConferenceWindow(conference);
    if (window.start && start < window.start) {
      return { ok: false, reason: 'outside_window', window };
    }
    if (window.end && end > window.end) {
      return { ok: false, reason: 'outside_window', window };
    }

    const entryKey = nextEntry.entryId || nextEntry.itemId;
    const conflict = entries.find((existing) => {
      if (!existing) {
        return false;
      }
      const existingKey = existing.entryId || existing.itemId;
      if (existingKey && entryKey && existingKey === entryKey) {
        return false;
      }
      if (!existing.roomId || existing.roomId !== nextEntry.roomId) {
        return false;
      }
      const existingStart = parseTimestamp(existing.startTime);
      const existingEnd = parseTimestamp(existing.endTime);
      if (!existingStart || !existingEnd) {
        return false;
      }
      return overlaps(start, end, existingStart, existingEnd);
    });

    if (conflict) {
      return {
        ok: false,
        reason: 'conflict',
        conflictEntry: conflict,
      };
    }

    const duplicatePaper = entries.find((existing) => {
      if (!existing) {
        return false;
      }
      const existingKey = existing.entryId || existing.itemId;
      if (existingKey && entryKey && existingKey === entryKey) {
        return false;
      }
      return existing.paperId === nextEntry.paperId;
    });

    if (duplicatePaper) {
      return {
        ok: false,
        reason: 'duplicate_paper',
        conflictEntry: duplicatePaper,
      };
    }

    return { ok: true, entry: nextEntry };
  },
};
