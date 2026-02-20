export const performanceService = {
  now() {
    return Date.now();
  },
  elapsedSince(startTime, now = Date.now()) {
    return now - startTime;
  },
};
