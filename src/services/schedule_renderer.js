function normalizeItems(items) {
  return Array.isArray(items) ? items.slice() : [];
}

function isScheduled(item) {
  return item
    && item.status === 'scheduled'
    && (item.roomName || item.roomId)
    && item.startTime
    && item.endTime;
}

function sortByTime(a, b) {
  const aTime = Date.parse(a.startTime);
  const bTime = Date.parse(b.startTime);
  if (Number.isNaN(aTime) && Number.isNaN(bTime)) {
    return 0;
  }
  if (Number.isNaN(aTime)) {
    return 1;
  }
  if (Number.isNaN(bTime)) {
    return -1;
  }
  return aTime - bTime;
}

export const scheduleRenderer = {
  renderAgenda({ items } = {}) {
    const normalized = normalizeItems(items);
    const roomsMap = new Map();
    const unscheduled = [];

    normalized.forEach((item) => {
      if (!item) {
        return;
      }
      if (!isScheduled(item)) {
        unscheduled.push(item);
        return;
      }
      const roomName = item.roomName || item.roomId;
      if (!roomsMap.has(roomName)) {
        roomsMap.set(roomName, []);
      }
      roomsMap.get(roomName).push(item);
    });

    const rooms = Array.from(roomsMap.keys()).sort().map((roomName) => {
      const roomItems = roomsMap.get(roomName).slice().sort(sortByTime);
      return { roomName, items: roomItems };
    });

    return { rooms, unscheduled };
  },
};
