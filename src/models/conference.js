function generateConferenceId() {
  return `conf_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export function createConference({
  conferenceId = null,
  dateRange = null,
  rooms = [],
  slotDurationMinutes = 0,
  constraints = null,
} = {}) {
  return {
    conferenceId: conferenceId || generateConferenceId(),
    dateRange,
    rooms: Array.isArray(rooms) ? rooms.slice() : [],
    slotDurationMinutes,
    constraints,
  };
}
