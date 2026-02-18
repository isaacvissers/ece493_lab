const failures = [];

export const errorLog = {
  logFailure(details) {
    failures.push({
      ...details,
      timestamp: new Date().toISOString(),
    });
  },
  getFailures() {
    return failures.slice();
  },
  clear() {
    failures.length = 0;
  },
};
