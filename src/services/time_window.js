export function parseTimestamp(value) {
  if (!value) {
    return null;
  }
  const timestamp = typeof value === 'number' ? value : Date.parse(value);
  if (Number.isNaN(timestamp)) {
    return null;
  }
  return timestamp;
}

export function isWithinWindow({ timestamp, now = Date.now(), windowMs = 5 * 60 * 1000 } = {}) {
  const parsed = parseTimestamp(timestamp);
  if (parsed === null) {
    return false;
  }
  const nowValue = typeof now === 'number' ? now : parseTimestamp(now);
  if (nowValue === null) {
    return false;
  }
  return Math.abs(nowValue - parsed) <= windowMs;
}
