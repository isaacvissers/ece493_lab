function generatePublicScheduleId() {
  return `public_sched_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export function createPublicSchedule({
  id = null,
  status = 'unpublished',
  publishedAt = null,
  lastUpdatedAt = null,
  entries = [],
  announcementId = null,
} = {}) {
  return {
    id: id || generatePublicScheduleId(),
    status,
    publishedAt,
    lastUpdatedAt,
    entries: Array.isArray(entries) ? entries : [],
    announcementId,
  };
}
