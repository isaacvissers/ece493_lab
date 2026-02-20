function generateItemId() {
  return `item_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export function createScheduleItem({
  itemId = null,
  scheduleId,
  paperId,
  roomId = null,
  slotId = null,
  status = 'scheduled',
  reason = null,
} = {}) {
  return {
    itemId: itemId || generateItemId(),
    scheduleId,
    paperId,
    roomId,
    slotId,
    status,
    reason,
  };
}
