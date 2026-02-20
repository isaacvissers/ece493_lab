function parseDate(value) {
  if (!value) {
    return null;
  }
  const timestamp = Date.parse(value);
  if (Number.isNaN(timestamp)) {
    return null;
  }
  return new Date(timestamp).toISOString();
}

function parseRooms(raw) {
  if (Array.isArray(raw)) {
    return raw;
  }
  if (!raw) {
    return [];
  }
  return raw.split('\n').map((line) => line.trim()).filter(Boolean).map((line) => {
    const parts = line.split('|').map((part) => part.trim()).filter(Boolean);
    const name = parts[0] || '';
    const capacity = parts[1] ? Number(parts[1]) : null;
    return {
      name,
      capacity: Number.isFinite(capacity) ? capacity : null,
    };
  });
}

export const scheduleValidation = {
  validateInputs(values = {}) {
    const errors = {};
    const conferenceId = (values.conferenceId || '').trim();
    if (!conferenceId) {
      errors.conferenceId = 'required';
    }

    const start = parseDate(values.startDate);
    const end = parseDate(values.endDate);
    if (!start) {
      errors.startDate = 'invalid';
    }
    if (!end) {
      errors.endDate = 'invalid';
    }
    if (start && end) {
      if (Date.parse(start) >= Date.parse(end)) {
        errors.endDate = 'range';
      }
    }

    const slotDurationMinutes = Number(values.slotDurationMinutes);
    if (!Number.isFinite(slotDurationMinutes) || slotDurationMinutes <= 0) {
      errors.slotDurationMinutes = 'invalid';
    }

    const rooms = parseRooms(values.rooms);
    if (!rooms.length) {
      errors.rooms = 'required';
    } else if (rooms.some((room) => !room.name)) {
      errors.rooms = 'invalid';
    }

    return {
      ok: Object.keys(errors).length === 0,
      errors,
      values: {
        conferenceId,
        dateRange: start && end ? { start, end } : null,
        slotDurationMinutes,
        rooms,
      },
    };
  },
};
