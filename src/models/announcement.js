function generateAnnouncementId() {
  return `announcement_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export function createAnnouncement({
  id = null,
  title = '',
  summary = '',
  scheduleLink = '',
  lastUpdatedAt = null,
} = {}) {
  return {
    id: id || generateAnnouncementId(),
    title,
    summary,
    scheduleLink,
    lastUpdatedAt,
  };
}
