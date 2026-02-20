function generateEntryId() {
  return `entry_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export function createScheduleEntry({
  entryId = null,
  scheduleId,
  paperId,
  roomId,
  startTime,
  endTime,
} = {}) {
  return {
    entryId: entryId || generateEntryId(),
    scheduleId,
    paperId,
    roomId,
    startTime,
    endTime,
  };
}
