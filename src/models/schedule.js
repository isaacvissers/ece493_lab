function generateScheduleId() {
  return `sched_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export function createSchedule({
  scheduleId = null,
  conferenceId,
  status = 'draft',
  createdAt = null,
  updatedAt = null,
} = {}) {
  const now = new Date().toISOString();
  const created = createdAt || now;
  return {
    scheduleId: scheduleId || generateScheduleId(),
    conferenceId,
    status,
    createdAt: created,
    updatedAt: updatedAt || created,
  };
}
