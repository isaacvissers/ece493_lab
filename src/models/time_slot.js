function generateSlotId() {
  return `slot_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export function createTimeSlot({
  slotId = null,
  startTime,
  endTime,
  roomId,
} = {}) {
  return {
    slotId: slotId || generateSlotId(),
    startTime,
    endTime,
    roomId,
  };
}
