function parseReleaseAt(releaseAt) {
  if (!releaseAt) {
    return null;
  }
  const timestamp = Date.parse(releaseAt);
  return Number.isNaN(timestamp) ? null : timestamp;
}

export const releaseScheduler = {
  getDelayMs(releaseAt, now = Date.now()) {
    const timestamp = parseReleaseAt(releaseAt);
    if (timestamp === null) {
      return 0;
    }
    return Math.max(timestamp - now, 0);
  },
  isReleased(releaseAt, now = Date.now()) {
    const timestamp = parseReleaseAt(releaseAt);
    if (timestamp === null) {
      return true;
    }
    return timestamp <= now;
  },
  schedule({ releaseAt, onRelease, now = Date.now() } = {}) {
    const delay = releaseScheduler.getDelayMs(releaseAt, now);
    if (delay === 0) {
      if (onRelease) {
        onRelease();
      }
      return { cancel() {} };
    }
    const timeoutId = setTimeout(() => {
      if (onRelease) {
        onRelease();
      }
    }, delay);
    return {
      cancel() {
        clearTimeout(timeoutId);
      },
    };
  },
};
