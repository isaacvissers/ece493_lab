function generateRoomId() {
  return `room_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export function createRoom({
  roomId = null,
  name = '',
  capacity = null,
} = {}) {
  const numericCapacity = capacity === null || capacity === undefined ? null : Number(capacity);
  return {
    roomId: roomId || generateRoomId(),
    name,
    capacity: Number.isFinite(numericCapacity) ? numericCapacity : null,
  };
}
